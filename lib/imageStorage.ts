'use server';

/**
 * Image Storage Solution: ImgBB API (Free, 32MB limit)
 * 
 * Setup:
 * 1. Get API key: b6632d88e03b63947083f55f13930ff6
 * 2. Add to .env.local: NEXT_PUBLIC_IMGBB_API_KEY=b6632d88e03b63947083f55f13930ff6
 * 
 * Images upload automatically when users submit evidence
 */

/**
 * Upload image to ImgBB
 * Returns the image URL or base64 if upload fails
 */
async function uploadToImgBB(base64Image: string): Promise<string> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    // If no ImgBB config, return base64 (fallback)
    if (!apiKey) {
      console.log('ImgBB not configured, storing image as base64');
      return base64Image;
    }

    // Remove data URL prefix
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

    // Create FormData
    const formData = new FormData();
    formData.append('key', apiKey);
    formData.append('image', base64Data);
    formData.append('name', `evidence_${Date.now()}`);
    
    // Upload to ImgBB
    const uploadResponse = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      console.warn('ImgBB upload failed:', uploadResponse.status);
      return base64Image;
    }

    const data = await uploadResponse.json();
    
    if (data.success && data.data?.url) {
      console.log('✓ Image uploaded to ImgBB:', data.data.url);
      return data.data.url;
    }

    if (data.error) {
      console.warn('ImgBB error:', data.error.message);
    }

    return base64Image;
  } catch (error) {
    console.warn('Error uploading to ImgBB, falling back to base64:', error);
    return base64Image;
  }
}

/**
 * Process image for submission
 * Tries ImgBB first, falls back to base64
 */
export async function processImageForSubmission(base64Image: string | null): Promise<string[]> {
  if (!base64Image) {
    return [];
  }

  try {
    const imageUrl = await uploadToImgBB(base64Image);
    return [imageUrl];
  } catch (error) {
    console.error('Error processing image:', error);
    return [base64Image];
  }
}



