// update-apk-versions.js
import { readFile, writeFile } from 'fs/promises';
import fetch from 'node-fetch';
import { gunzip } from 'zlib';
import { promisify } from 'util';
import { extract } from 'tar-stream';

const gunzipAsync = promisify(gunzip);

// File to read and update
const DOCKERFILE_PATH = './Dockerfile';

/**
 * Gets the latest package version from Alpine repository index
 * @param {string} packageName - Name of the package to check
 * @param {string} repo - Repository to check ('main' or 'community')
 * @param {string} alpineVersion - Alpine version (e.g., '3.21')
 * @returns {Promise<string|null>} The latest package version or null if not found
 */
async function getVersionFromRepoIndex(packageName, repo = 'main', alpineVersion = '3.21') {
  try {
    // URL to the repository index
    const indexUrl = `http://dl-cdn.alpinelinux.org/alpine/v${alpineVersion}/${repo}/x86_64/APKINDEX.tar.gz`;
    
    // Fetch the compressed index
    const response = await fetch(indexUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch index: ${response.statusText}`);
    }
    
    // Get the buffer from the response
    const compressedData = await response.arrayBuffer();
    const compressedBuffer = Buffer.from(compressedData);
    
    // Decompress the gzip data
    const tarData = await gunzipAsync(compressedBuffer);
    
    // Extract and parse the APKINDEX file from the tar archive
    return new Promise((resolve, reject) => {
      const extractor = extract();
      
      extractor.on('entry', (header, stream, next) => {
        if (header.name === 'APKINDEX') {
          let data = '';
          
          stream.on('data', (chunk) => {
            data += chunk.toString();
          });
          
          stream.on('end', () => {
            // The APKINDEX file format has packages separated by blank lines
            const packageBlocks = data.split('\n\n');
            
            for (const block of packageBlocks) {
              const lines = block.split('\n');
              let currentPackageName = null;
              let currentVersion = null;
              
              // Each block has multiple lines with prefixes like P: (package), V: (version)
              for (const line of lines) {
                if (line.startsWith('P:') && line.substring(2) === packageName) {
                  currentPackageName = packageName;
                } else if (line.startsWith('V:') && currentPackageName === packageName) {
                  currentVersion = line.substring(2);
                  break;
                }
              }
              
              if (currentPackageName === packageName && currentVersion) {
                resolve(currentVersion);
                return;
              }
            }
            
            // Package not found in this repository
            resolve(null);
            next();
          });
        } else {
          stream.on('end', next);
        }
        
        // Always resume the stream to avoid hanging
        stream.resume();
      });
      
      extractor.on('finish', () => {
        // If we get here without finding the package, it's not in this repo
        resolve(null);
      });
      
      extractor.on('error', (err) => {
        console.error(`Error extracting index: ${err.message}`);
        reject(err);
      });
      
      // Process the tar data
      extractor.write(tarData);
      extractor.end();
    });
  } catch (error) {
    console.error(`Error fetching package index for ${packageName}: ${error.message}`);
    return null;
  }
}

/**
 * Checks both main and community repositories for the latest package version
 * @param {string} packageName - Name of the package
 * @param {string} alpineVersion - Alpine version (e.g., '3.21')
 * @returns {Promise<string|null>} Latest version or null if not found
 */
async function getVersionFromAlpineRepos(packageName, alpineVersion = '3.21') {
  // Try main repository first
  let version = await getVersionFromRepoIndex(packageName, 'main', alpineVersion);
  
  // If not found in main, try community
  if (!version) {
    version = await getVersionFromRepoIndex(packageName, 'community', alpineVersion);
  }
  
  if (!version) {
    // Package not found in any repository
  }
  
  return version;
}

/**
 * Gets the latest version for a package from Alpine repositories
 * @param {string} packageName - Name of the package
 * @param {string} currentVersion - Current version in the Dockerfile
 * @param {string} alpineVersion - Alpine version to check against
 * @returns {Promise<string>} Latest version or current version if none found
 */
async function getLatestVersion(packageName, currentVersion, alpineVersion) {
  const latestVersion = await getVersionFromAlpineRepos(packageName, alpineVersion);
  return latestVersion || currentVersion;
}

/**
 * Extracts the Alpine version from a Dockerfile's FROM instruction
 * @param {string} dockerfileContent - The contents of the Dockerfile
 * @returns {string|null} - The Alpine version or null if not found
 */
function getAlpineVersionFromDockerfile(dockerfileContent) {
  try {
    const alpineRegex = /^FROM\s+alpine:([0-9]+\.[0-9]+(?:\.[0-9]+)?|latest)/m;
    const match = dockerfileContent.match(alpineRegex);
    
    if (match && match[1]) {
      // If it's "latest", we can't determine the version from the Dockerfile
      if (match[1] === 'latest') {
        return null;
      }
      
      // For version like 3.21.3, return the major.minor version (3.21)
      // This is needed because Alpine repository URLs use v3.21, not v3.21.3
      const versionParts = match[1].split('.');
      if (versionParts.length >= 2) {
        return `${versionParts[0]}.${versionParts[1]}`;
      }
      
      return match[1];
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing Alpine version from Dockerfile:', error);
    return null;
  }
}

/**
 * Formats the updated packages as Simple Arrow Format
 * @param {Array} packages - Array of package update information
 * @returns {string} Formatted output
 */
function formatSimpleArrowFormat(packages) {
  if (packages.length === 0) {
    return 'No package updates found.';
  }

  // Get the maximum length of package names and versions for formatting
  const maxPackageNameLength = Math.max(...packages.map(pkg => pkg.name.length));
  const maxVersionLength = Math.max(...packages.map(pkg => pkg.currentVersion.length));
  
  // Create header
  let output = `Found: ${packages.length} apk package(s) found in Dockerfile\n\n`;
  
  // Create rows for each package
  packages.forEach(pkg => {
    // const status = pkg.updated ? '[UPDATED]' : '[NO CHANGE]';
    const symbol = pkg.updated ? '=>' : '==';
    // Ensure consistent spacing before the symbol for alignment
    output += `${padRight(pkg.name, maxPackageNameLength)}    : ${padRight(pkg.currentVersion, maxVersionLength)}  ${symbol}  ${pkg.newVersion}\n`;
  });
  
  // Add summary
  const updatedCount = packages.filter(pkg => pkg.updated).length;
  output += `\nSummary: ${updatedCount} package(s) updated successfully`;
  
  return output;
}

/**
 * Helper function to pad a string to a specific length
 * @param {string} str - String to pad
 * @param {number} length - Length to pad to
 * @returns {string} Padded string
 */
function padRight(str, length) {
  return str.padEnd(length, ' ');
}

// Main function to update Dockerfile
async function updateDockerfile() {
  try {
    // Read the Dockerfile
    const content = await readFile(DOCKERFILE_PATH, 'utf8');
   
    // Get the alpine version from the Dockerfile
    const alpineVersion = getAlpineVersionFromDockerfile(content) || '3.21';
    
    // Define regex pattern to match package=version
    const pattern = /(\s.)([a-zA-Z0-9\-]+)=([0-9]+\.[0-9]+\.[0-9]+-r[0-9]+)(\s*\\?)/g;
    
    let hasChanges = false;
    let updatedContent = content;

    // Array to store package update information
    const packageUpdates = [];
    
    // We need to handle async replacements differently since regex replace is synchronous
    const matches = Array.from(content.matchAll(pattern));
    
    // Process each match sequentially
    for (const match of matches) {
      const [fullMatch, spacing, packageName, version, ending] = match;
      
      // Get latest version from repositories
      const latestVersion = await getLatestVersion(packageName, version, alpineVersion);
      
      // Store package update information
      packageUpdates.push({
        name: packageName,
        currentVersion: version,
        newVersion: latestVersion,
        updated: latestVersion !== version
      });
      
      if (latestVersion !== version) {
        hasChanges = true;
        
        // Replace just this occurrence
        updatedContent = updatedContent.replace(
          `${spacing}${packageName}=${version}${ending}`,
          `${spacing}${packageName}=${latestVersion}${ending}`
        );
      }
    }
    
    // Display the formatted output using Simple Arrow Format
    console.log('\n' + formatSimpleArrowFormat(packageUpdates) + '\n');
    
    // Only write back if changes were made
    if (hasChanges) {
      await writeFile(DOCKERFILE_PATH, updatedContent, 'utf8');
    }
    
    return hasChanges;
  } catch (error) {
    console.error('Error updating Dockerfile:', error.message);
    throw error;
  }
}

// Run the update function
try {
  await updateDockerfile();
} catch (error) {
  process.exit(1);
}
