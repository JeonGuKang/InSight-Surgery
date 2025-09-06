/**
 * @fileoverview Application configuration.
 *
 * This file centralizes access to environment variables and other configuration
 * settings for the application.
 */

/**
 * The application configuration object.
 */
export const config = {
  /**
   * The API key for the Google Gemini API.
   *
   * IMPORTANT: This key is sourced from the `process.env.API_KEY` environment
   * variable, which is securely managed by the execution environment.
   * Do not hardcode any keys in this file.
   */
  apiKey: process.env.API_KEY,
  
};
