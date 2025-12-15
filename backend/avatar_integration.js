/**
 * Avatar Integration Module
 * Handles D-ID API integration for realistic avatar video generation
 */

const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config({ path: '../config/.env' });

class AvatarIntegration {
    constructor() {
        this.apiKey = process.env.D_ID_API_KEY;
        this.baseUrl = 'https://api.d-id.com';
        this.headers = {
            'Authorization': `Basic ${this.apiKey}`,
            'Content-Type': 'application/json'
        };
    }

    /**
     * Create a talking avatar video from text
     * @param {string} text - The text for the avatar to speak
     * @param {string} avatarUrl - URL of the avatar image (optional)
     * @param {Object} options - Additional options
     * @returns {Promise<Object>} Video generation result
     */
    async createTalkingAvatar(text, avatarUrl = null, options = {}) {
        try {
            const payload = {
                script: {
                    type: 'text',
                    input: text,
                    provider: {
                        type: 'microsoft',
                        voice_id: options.voiceId || 'en-US-JennyNeural'
                    }
                },
                config: {
                    fluent: true,
                    pad_audio: 0,
                    stitch: true
                }
            };

            // Add avatar image if provided
            if (avatarUrl) {
                payload.source_url = avatarUrl;
            } else {
                // Use default avatar
                payload.source_url = 'https://create-images-results.d-id.com/DefaultPresenters/Noelle_f/image.jpeg';
            }

            const response = await axios.post(
                `${this.baseUrl}/talks`,
                payload,
                { headers: this.headers }
            );

            return {
                success: true,
                talkId: response.data.id,
                status: response.data.status,
                data: response.data
            };

        } catch (error) {
            console.error('Error creating talking avatar:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    }

    /**
     * Get the status of a video generation
     * @param {string} talkId - The ID of the talk/video
     * @returns {Promise<Object>} Status and video URL if ready
     */
    async getTalkStatus(talkId) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/talks/${talkId}`,
                { headers: this.headers }
            );

            const status = response.data.status;
            const result = {
                success: true,
                status: status,
                data: response.data
            };

            // If video is ready, include the URL
            if (status === 'done') {
                result.videoUrl = response.data.result_url;
            }

            return result;

        } catch (error) {
            console.error('Error getting talk status:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    }

    /**
     * Wait for video generation to complete
     * @param {string} talkId - The ID of the talk/video
     * @param {number} maxWaitTime - Maximum time to wait in milliseconds
     * @returns {Promise<Object>} Final status with video URL
     */
    async waitForVideoCompletion(talkId, maxWaitTime = 60000) {
        const startTime = Date.now();
        const pollInterval = 2000; // Check every 2 seconds

        while (Date.now() - startTime < maxWaitTime) {
            const status = await this.getTalkStatus(talkId);

            if (!status.success) {
                return status;
            }

            if (status.status === 'done') {
                return status;
            }

            if (status.status === 'error' || status.status === 'rejected') {
                return {
                    success: false,
                    error: 'Video generation failed',
                    data: status.data
                };
            }

            // Wait before next poll
            await new Promise(resolve => setTimeout(resolve, pollInterval));
        }

        return {
            success: false,
            error: 'Video generation timeout'
        };
    }

    /**
     * Create and wait for avatar video (convenience method)
     * @param {string} text - The text for the avatar to speak
     * @param {string} avatarUrl - URL of the avatar image (optional)
     * @param {Object} options - Additional options
     * @returns {Promise<Object>} Complete video result with URL
     */
    async generateAvatarVideo(text, avatarUrl = null, options = {}) {
        // Create the video
        const createResult = await this.createTalkingAvatar(text, avatarUrl, options);

        if (!createResult.success) {
            return createResult;
        }

        // Wait for completion
        const finalResult = await this.waitForVideoCompletion(createResult.talkId);

        return finalResult;
    }

    /**
     * Get list of available avatars
     * @returns {Promise<Object>} List of available avatars
     */
    async getAvailableAvatars() {
        try {
            const response = await axios.get(
                `${this.baseUrl}/images`,
                { headers: this.headers }
            );

            return {
                success: true,
                avatars: response.data.images
            };

        } catch (error) {
            console.error('Error getting avatars:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    }

    /**
     * Get list of available voices
     * @returns {Promise<Object>} List of available voices
     */
    async getAvailableVoices() {
        // Microsoft Azure voices commonly used with D-ID
        return {
            success: true,
            voices: [
                { id: 'en-US-JennyNeural', name: 'Jenny (Female, US)', language: 'en-US' },
                { id: 'en-US-GuyNeural', name: 'Guy (Male, US)', language: 'en-US' },
                { id: 'en-GB-SoniaNeural', name: 'Sonia (Female, UK)', language: 'en-GB' },
                { id: 'en-GB-RyanNeural', name: 'Ryan (Male, UK)', language: 'en-GB' },
                { id: 'en-AU-NatashaNeural', name: 'Natasha (Female, AU)', language: 'en-AU' },
                { id: 'en-AU-WilliamNeural', name: 'William (Male, AU)', language: 'en-AU' }
            ]
        };
    }

    /**
     * Delete a generated video
     * @param {string} talkId - The ID of the talk/video to delete
     * @returns {Promise<Object>} Deletion result
     */
    async deleteTalk(talkId) {
        try {
            await axios.delete(
                `${this.baseUrl}/talks/${talkId}`,
                { headers: this.headers }
            );

            return {
                success: true,
                message: 'Video deleted successfully'
            };

        } catch (error) {
            console.error('Error deleting talk:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    }
}

// Export for use in other modules
module.exports = AvatarIntegration;

// Example usage
if (require.main === module) {
    const avatar = new AvatarIntegration();

    // Test the integration
    (async () => {
        console.log('Testing D-ID Avatar Integration...\n');

        // Generate a test video
        console.log('Generating avatar video...');
        const result = await avatar.generateAvatarVideo(
            'Hello! I am your AI avatar assistant. How can I help you today?'
        );

        if (result.success) {
            console.log('✓ Video generated successfully!');
            console.log('Video URL:', result.videoUrl);
        } else {
            console.log('✗ Error:', result.error);
        }
    })();
}
