// API functions for publisher management
import type {
  AllowedPagePosition,
  AllowedPageSelector,
  AllowedPageType
} from "../constants/pageRules.js";

export interface PublisherListItem {
  id: string;
  alias: string;
  file: string;
}

export interface PublisherData {
  publisherId: string;
  aliasName?: string;
  pages?: Array<{
    pageType: AllowedPageType;
    selector: AllowedPageSelector;
    position: AllowedPagePosition;
  }>;
  publisherDashboard?: string;
  monitorDashboard?: string;
  qaStatusDashboard?: string;
  isActive?: boolean;
  customCss?: string;
  tags?: string[];
  allowedDomains?: string[];
  notes?: string;
  [key: string]: unknown; // Extended/unknown fields preserved without unsafe any
}

// Get list of all publishers
export async function fetchPublishers(): Promise<PublisherListItem[]> {
  try {
    const response = await fetch("/api/publishers");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.publishers || [];
  } catch (error) {
    console.error("Error fetching publishers:", error);
    throw error;
  }
}

// Get specific publisher data
export async function fetchPublisher(filename: string): Promise<PublisherData> {
  try {
    const response = await fetch(`/api/publisher/${filename}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching publisher:", error);
    throw error;
  }
}

// Save publisher data
export async function savePublisher(filename: string, data: PublisherData): Promise<void> {
  try {
    const response = await fetch(`/api/publisher/${filename}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data, null, 2)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error saving publisher:", error);
    throw error;
  }
}

// Create new publisher
export async function createPublisher(publisherId: string, data: PublisherData): Promise<void> {
  const filename = `publisher-${publisherId}.json`;
  
  // Save the publisher data
  await savePublisher(filename, data);
  
  // Update publishers list
  await updatePublishersList(publisherId, data.aliasName || publisherId, filename);
}

// Update publishers list
export async function updatePublishersList(id: string, alias: string, filename: string): Promise<void> {
  try {
    // First, get current publishers list
    const publishers = await fetchPublishers();
    
    // Check if publisher already exists
    const existingIndex = publishers.findIndex(p => p.id === id);
    
    if (existingIndex !== -1) {
      // Update existing publisher
      publishers[existingIndex] = { id, alias, file: filename };
    } else {
      // Add new publisher
      publishers.push({ id, alias, file: filename });
    }
    
    // Save updated list
    const response = await fetch("/api/publisher/publishers.json", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publishers }, null, 2)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error updating publishers list:", error);
    throw error;
  }
}

// Delete publisher
export async function deletePublisher(id: string): Promise<void> {
  try {
    const filename = `publisher-${id}.json`;
    const deleteResponse = await fetch(`/api/publisher/${filename}`, { method: "DELETE" });
    if (!deleteResponse.ok && deleteResponse.status !== 404) {
      throw new Error(`Failed to delete publisher file: ${deleteResponse.status}`);
    }
  } catch (error) {
    console.error("Error deleting publisher:", error);
    throw error;
  }
}

// Upload JSON file and create publisher
export async function uploadPublisherFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // Validate that it's a publisher file
        if (!data.publisherId && !data.id) {
          throw new Error("Invalid publisher file: missing publisherId or id field");
        }
        
          const publisherId = data.publisherId || data.id;
        
        // Normalize the data to match our expected format
        const normalizedData: PublisherData = {
          publisherId,
          aliasName: data.aliasName || data.alias,
          pages: data.pages || data.pageConfigs,
          publisherDashboard: data.publisherDashboard || data.dashboards?.publisher,
          monitorDashboard: data.monitorDashboard || data.dashboards?.monitor,
          qaStatusDashboard: data.qaStatusDashboard || data.dashboards?.qa,
          isActive: data.isActive !== undefined ? data.isActive : data.active,
          customCss: data.customCss || data.advancedSettings?.customCSS,
          tags: data.tags,
          allowedDomains: data.allowedDomains || data.advancedSettings?.allowedDomains,
          notes: data.notes || data.advancedSettings?.notes,
          ...data // Include any additional fields
        };
        
        // Save the publisher
        await createPublisher(publisherId, normalizedData);
        
        resolve(publisherId);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}