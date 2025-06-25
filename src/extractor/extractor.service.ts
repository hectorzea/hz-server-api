import { Injectable } from "@nestjs/common";
import * as puppeteer from "puppeteer";

@Injectable()
export class ExtractorService {
  async extractJobContent(url: string): Promise<string> {
    if (!url || !url.startsWith("http")) {
      throw new Error("Invalid URL provided.");
    }
    const wsChromeEndpointUrl =
      "ws://127.0.0.1:9222/devtools/browser/c3c1178d-b510-4877-9d06-56e65536cf15";
    const browser = await puppeteer.connect({
      browserWSEndpoint: wsChromeEndpointUrl
    });
    const page = await browser.newPage();
    try {
      await page.goto(url);
      // Reemplaza uno o más espacios/saltos por un solo espacio, luego trim final.
      const companyName: string | null = await page.evaluate(() => {
        const companyElement = document.querySelector(
          ".job-details-jobs-unified-top-card__company-name"
        );
        let companyRawText = companyElement?.textContent || "";
        companyRawText = companyRawText.replace(/\s+/g, " ").trim();
        return companyRawText;
      });

      const jobTitle: string | null = await page.evaluate(() => {
        const titleElement = document.querySelector(
          ".job-details-jobs-unified-top-card__job-title"
        );
        let titleRawText = titleElement?.textContent || "";
        titleRawText = titleRawText.replace(/\s+/g, " ").trim();
        return titleRawText;
      });

      const jobDetails: string | null = await page.evaluate(() => {
        const jobDetailsElement = document.querySelector("#job-details");
        let jobDetailsRawText = jobDetailsElement?.textContent || "";
        jobDetailsRawText = jobDetailsRawText.replace(/\s+/g, " ").trim();
        return jobDetailsRawText;
      });

      const jobOfferDataString = `Company Name: ${companyName} // Job Title:${jobTitle} // Job Details: ${jobDetails}`;

      return jobOfferDataString;
    } catch (error) {
      await browser.close();
      throw new Error("Error on scrapping webpage", {
        cause: error
      });
    }
  }
}
