'use server';

/**
 * Image Storage Solution: Cloudinary API (Free, Fast, Reliable)
 * 
 * Setup (2 minutes):
 * 1. Go to https://cloudinary.com/users/register/free
 * 2. Sign up (free account, no credit card)
 * 3. Copy your Cloud Name
 * 4. Add to .env.local: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
 * 
 * Images upload automatically when users submit evidence
 */

/**
 * Upload image to Cloudinary (unsigned upload)
 * Uses an unsigned upload preset for client-side uploads without API key exposure
 * Returns the image URL or base64 if upload fails
 */
async function uploadToCloudinary(base64Image: string): Promise<string> {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    // If no Cloudinary config, return base64 (fallback)
    if (!cloudName) {
      console.log('Cloudinary not configured, storing image as base64');
      return base64Image;
    }

    // Create FormData from base64
    const formData = new FormData();
    
    // Convert base64 to Blob
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'image/jpeg' });
    
    // Generate unique public ID: evidence_[timestamp]_[random]
    const publicId = `evidence_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Append to form
    formData.append('file', blob);
    formData.append('upload_preset', 'peep_evidence');
    formData.append('public_id', publicId); // Use generated public ID
    formData.append('unique_filename', 'false'); // Disable unique suffix
    
    // Upload to Cloudinary
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      console.warn('Cloudinary upload failed:', uploadResponse.status);
      return base64Image;
    }

    const data = await uploadResponse.json();
    if (data.secure_url) {
      console.log('✓ Image uploaded to Cloudinary:', data.secure_url);
      console.log('  Public ID:', data.public_id);
      return data.secure_url;
    }

    return base64Image;
  } catch (error) {
    console.warn('Error uploading to Cloudinary, falling back to base64:', error);
    return base64Image;
  }
}

/**
 * Process image for submission
 * Tries Cloudinary first, falls back to base64
 */
export async function processImageForSubmission(base64Image: string | null): Promise<string[]> {
  if (!base64Image) {
    return [];
  }

  try {
    const imageUrl = await uploadToCloudinary(base64Image);
    return [imageUrl];
  } catch (error) {
    console.error('Error processing image:', error);
    return [base64Image];
  }
}



