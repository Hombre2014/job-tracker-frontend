'use client';
import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Privacy Policy for Job Tracker Extension</h1>
      <p className="mb-8 mt-2">
        <strong>Last Updated:</strong> February 2, 2026
      </p>
      <h2 className="text-2xl font-bold mt-8">Overview</h2>
      <p className="mb-8 mt-2">
        Job Tracker Extension (&quot;we&quot;, &quot;our&quot;, or &quot;the
        extension&quot;) is committed to protecting your privacy. This Privacy
        Policy explains how we handle information when you use our Chrome
        extension.
      </p>
      <h2 className="text-2xl font-bold mt-8">Information Collection and Use</h2>
      <h3 className="mt-4 text-xl font-bold">Data We Collect</h3>
      <ol className="list-decimal list-inside flex flex-col pl-4 my-4">
        <li className="mb-2">
          <strong>Authentication Information</strong>
          <ul>
            <li>
              Authentication tokens to communicate with the Job Tracker web
              application
            </li>
            <li>
              Stored locally in your browser using Chrome&apos;s storage API
            </li>
            <li>
              Used solely to authenticate your requests to your Job Tracker
              account
            </li>
          </ul>
        </li>
        <li>
          <strong>User Activity Data</strong>
          <ul>
            <li>Jobs you choose to save</li>
            <li>Board selections and organization preferences</li>
            <li>Notes, tags, and ratings you add to job postings</li>
            <li>
              This data is sent to and stored in your personal Job Tracker
              account
            </li>
          </ul>
        </li>
        <li>
          <strong>Website Content</strong>
          <ul>
            <li>
              Job posting information scraped from LinkedIn and Indeed,
              including:
              <ul>
                <li>Job titles and descriptions</li>
                <li>Company names and locations</li>
                <li>Salary information (when available)</li>
                <li>Application URLs</li>
              </ul>
            </li>
            <li>
              This data is processed locally and transmitted only to your Job
              Tracker account
            </li>
          </ul>
        </li>
      </ol>
      <h3 className="mt-4 text-xl font-bold">How We Use Your Data</h3>
      <p className="mb-8 mt-2">
        All collected data is used <strong>exclusively</strong> for the
        extension&apos;s single purpose: to help you save and organize job
        postings in your Job Tracker account.
      </p>
      <h3 className="mt-4 text-xl font-bold">Third-Party Data Sharing</h3>
      <p className="mb-8 mt-2">
        <strong>Company Name Autocomplete:</strong> When you use the company
        name search field, your typed queries are sent to Clearbit&apos;s
        autocomplete API to provide real-time suggestions. This is the only data
        shared with a third party (other than your own Job Tracker account).
      </p>
      <ul className="list-disc list-inside flex flex-col pl-4 my-4">
        <li className="mb-2">
          We do <strong>NOT</strong>:
          <ul>
            <li>Sell your data to third parties for profit</li>
            <li>Use your data for advertising or marketing</li>
            <li>Track your general browsing history</li>
            <li>
              Collect personally identifiable information beyond what&apos;s
              necessary for authentication and functionality
            </li>
            <li>
              Share job posting content or your saved jobs with third parties
              (only company search queries are shared with Clearbit for
              autocomplete)
            </li>
          </ul>
        </li>
      </ul>
      <h2 className="text-2xl font-bold mt-8">Data Storage</h2>
      <ul className="list-disc list-inside flex flex-col pl-4 my-4">
        <li className="mb-2">
          <strong>Local Storage:</strong> Authentication tokens are stored
          locally in your browser using Chrome&apos;s storage API
        </li>
        <li className="mb-2">
          <strong>Remote Storage:</strong> Job data you choose to save is
          transmitted to and stored in your Job Tracker account at{' '}
          <code>https://online-job-trackr.vercel.app</code>
        </li>
      </ul>
      <h2 className="text-2xl font-bold mt-8">Third-Party Services</h2>
      <ol className="list-decimal list-inside flex flex-col pl-4 my-4">
        <li className="mb-2">
          <strong>Job Tracker Web Application</strong> (
          <code>https://online-job-trackr.vercel.app</code>)
          <ul>
            <li>Your personal account where saved jobs are stored</li>
            <li>Owned and operated by us</li>
          </ul>
        </li>
        <li>
          <strong>Clearbit</strong> (
          <code>https://autocomplete.clearbit.com</code>)
          <ul>
            <li>
              Used to provide company name autocomplete suggestions and fetch
              company logos
            </li>
            <li>
              <strong>Data Shared:</strong> Company names you type in the
              company search field are sent to Clearbit&apos;s autocomplete API
            </li>
            <li>
              <strong>Privacy Impact:</strong> The company names you search for
              may reveal your job search interests
            </li>
            <li>
              <strong>Purpose:</strong> To provide real-time company suggestions
              and accurate company information
            </li>
            <li>
              <strong>Clearbit&apos;s Privacy Policy:</strong>{' '}
              <a
                href="https://clearbit.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://clearbit.com/privacy
              </a>
            </li>
            <li>
              Note: Clearbit may log these requests according to their own
              privacy practices
            </li>
          </ul>
        </li>
        <li>
          <strong>LinkedIn and Indeed</strong>
          <ul>
            <li>
              The extension reads publicly available job posting data from pages
              you visit
            </li>
            <li>No data is sent to LinkedIn or Indeed by the extension</li>
          </ul>
        </li>
      </ol>
      <h2 className="text-2xl font-bold mt-8">Legal Basis for Processing (GDPR Article 6)</h2>
      <ol className="list-decimal list-inside flex flex-col pl-4 my-4">
        <li className="mb-2">
          <strong>Contract Performance</strong> (Article 6(1)(b))
          <ul>
            <li>Authentication and account access</li>
            <li>Saving and retrieving job postings</li>
            <li>
              These are necessary to provide the service you requested by
              installing the extension
            </li>
          </ul>
        </li>
        <li>
          <strong>Legitimate Interest</strong> (Article 6(1)(f))
          <ul>
            <li>
              Company autocomplete via Clearbit to improve user experience
            </li>
            <li>
              You can disable this by not using the company search field or
              uninstalling the extension
            </li>
          </ul>
        </li>
        <li>
          <strong>Consent</strong> (Article 6(1)(a))
          <ul>
            <li>
              By installing and actively using this extension, you provide
              informed consent for the data processing described in this policy
            </li>
            <li>
              You can withdraw consent at any time by uninstalling the extension
            </li>
          </ul>
        </li>
      </ol>
      <h2 className="text-2xl font-bold mt-8">Data Security</h2>
      <ul className="list-disc list-inside flex flex-col pl-4 my-4">
        <li className="mb-2">
          Authentication tokens are stored securely in Chrome&apos;s storage
        </li>
        <li className="mb-2">
          All communications with the Job Tracker web application use HTTPS
          encryption
        </li>
        <li className="mb-2">
          We validate the origin of messages to prevent unauthorized access
        </li>
      </ul>
      <h2 className="text-2xl font-bold mt-8">Data Retention</h2>
      <h3 className="mt-4 text-xl font-bold">Local Storage (In Your Browser)</h3>
      <ul className="list-disc list-inside flex flex-col pl-4 my-4">
        <li className="mb-2">
          <strong>Authentication tokens</strong>: Retained until you log out,
          uninstall the extension, or clear browser data
        </li>
        <li className="mb-2">
          <strong>Cached data</strong>: Automatically cleared when you uninstall
          the extension
        </li>
      </ul>
      <h3 className="mt-4 text-xl font-bold">Remote Storage (In Your Job Tracker Account)</h3>
      <ul className="list-disc list-inside flex flex-col pl-4 my-4">
        <li className="mb-2">
          <strong>Job postings and related data</strong>: Retained indefinitely
          while your account remains active
        </li>
        <li className="mb-2">
          <strong>Account data</strong>: Retained until you explicitly delete
          jobs or your entire account
        </li>
      </ul>
      <h3 className="mt-4 text-xl font-bold">Data Deletion</h3>
      <ul className="list-disc list-inside flex flex-col pl-4 my-4">
        <li className="mb-2">
          <strong>Uninstall extension</strong>: Local storage data is
          immediately and permanently removed
        </li>
        <li className="mb-2">
          <strong>Log out</strong>: Authentication tokens are immediately
          deleted from local storage
        </li>
        <li className="mb-2">
          <strong>Delete jobs</strong>: Selected job posts are permanently
          deleted from your account within 24 hours
        </li>
        <li className="mb-2">
          <strong>Delete account</strong>: All associated data is permanently
          deleted within 30 days
        </li>
        <li className="mb-2">
          <strong>Request deletion</strong>: Contact us to request complete data
          deletion (processed within 30 days)
        </li>
      </ul>
      <p className="mb-8 mt-2">
        You may request complete account deletion and data erasure by contacting
        us through our GitHub Issues page.
      </p>
      <h2 className="text-2xl font-bold mt-8">International Data Transfers</h2>
      <h3 className="mt-4 text-xl font-bold">Data Location</h3>
      <ul className="list-disc list-inside flex flex-col pl-4 my-4">
        <li className="mb-2">
          <strong>Local Data</strong>: Stored in your browser on your device
          (remains in your location)
        </li>
        <li className="mb-2">
          <strong>Remote Data</strong>: Your Job Tracker account is hosted on
          Vercel&apos;s infrastructure, which may involve servers in various
          locations globally
        </li>
      </ul>
      <h3 className="mt-4 text-xl font-bold">Third-Party Services and Data Transfers</h3>
      <ol className="list-decimal list-inside flex flex-col pl-4 my-4">
        <li className="mb-2">
          <strong>Job Tracker Backend</strong> (
          <code>online-job-trackr.vercel.app</code>)
          <ul>
            <li>Hosted on Vercel (may be in US or EU depending on region)</li>
            <li>
              Data transfers are protected by Vercel&apos;s SOC 2 compliance and
              EU-US Data Privacy Framework
            </li>
          </ul>
        </li>
        <li>
          <strong>Clearbit</strong> (<code>autocomplete.clearbit.com</code>)
          <ul>
            <li>Based in the United States</li>
            <li>Company search queries may be transferred to US servers</li>
            <li>
              Protected under EU-US Data Privacy Framework and Standard
              Contractual Clauses
            </li>
          </ul>
        </li>
      </ol>
      <h3 className="mt-4 text-xl font-bold">Safeguards for EEA Users</h3>
      <ul className="list-disc list-inside flex flex-col pl-4 my-4">
        <li className="mb-2">
          <strong>Adequacy decisions</strong>: For transfers to countries deemed
          adequate by the European Commission
        </li>
        <li className="mb-2">
          <strong>Standard Contractual Clauses (SCCs)</strong>: For transfers to
          third-party services
        </li>
        <li className="mb-2">
          <strong>Encryption</strong>: All data transfers use HTTPS/TLS
          encryption
        </li>
      </ul>
      <h3 className="mt-4 text-xl font-bold">Your Control</h3>
      <ul className="list-disc list-inside flex flex-col pl-4 my-4">
        <li className="mb-2">
          Not using the company autocomplete feature (avoids Clearbit transfers)
        </li>
        <li className="mb-2">Uninstalling the extension to stop all data processing</li>
      </ul>
      <h2 className="text-2xl font-bold mt-8">Your Rights Under GDPR</h2>
      <p className="mb-8 mt-2">
        If you are in the European Economic Area (EEA), you have the following
        rights:
      </p>
      <ul className="list-disc list-inside flex flex-col pl-4 my-4">
        <li className="mb-2">
          <strong>Right of Access</strong>: View your saved jobs through your
          Job Tracker account
        </li>
        <li className="mb-2">
          <strong>Right to Rectification</strong>: Edit or correct your job data
          in your Job Tracker account
        </li>
        <li className="mb-2">
          <strong>Right to Erasure</strong>: Delete your data by removing jobs
          from your account or deleting your account entirely
        </li>
        <li className="mb-2">
          <strong>Right to Data Portability</strong>: Export your job data from
          your Job Tracker account
        </li>
        <li className="mb-2">
          <strong>Right to Withdraw Consent</strong>: Uninstall the extension at
          any time to stop all data processing and remove locally stored data
        </li>
        <li className="mb-2">
          <strong>Right to Object</strong>: Contact us to object to processing
          based on legitimate interest
        </li>
        <li className="mb-2">
          <strong>Right to Lodge a Complaint</strong>: Contact your local data
          protection authority
        </li>
      </ul>
      <h3 className="mt-4 text-xl font-bold">How to Exercise Your Rights</h3>
      <ul className="list-disc list-inside flex flex-col pl-4 my-4">
        <li className="mb-2">
          Stop using Clearbit autocomplete: Don&apos;t type in the company
          search field, or manually enter company names from scraped data
        </li>
        <li className="mb-2">
          Delete local data: Uninstall the extension (removes all Chrome storage
          data immediately)
        </li>
        <li className="mb-2">
          Delete account data: Log into your Job Tracker account and delete your
          jobs or account
        </li>
        <li className="mb-2">
          Withdraw all consent: Uninstall the extension - this is as easy as
          installing it was
        </li>
      </ul>
      <h2 className="text-2xl font-bold mt-8">Changes to This Policy</h2>
      <p className="mb-8 mt-2">
        We may update this Privacy Policy from time to time. Any changes will be
        reflected in the &quot;Last Updated&quot; date at the top of this
        document.
      </p>
      <h2 className="text-2xl font-bold mt-8">Contact Us</h2>
      <p className="mb-8 mt-2">
        If you have questions or concerns about this Privacy Policy, please
        contact us:
      </p>
      <ul className="list-disc list-inside flex flex-col pl-4 my-4">
        <li className="mb-2">
          <strong>GitHub Issues:</strong>{' '}
          <a
            href="https://github.com/Hombre2014/job-tracker-extension/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://github.com/Hombre2014/job-tracker-extension/issues
          </a>
        </li>
        <li className="mb-2">
          <strong>Repository:</strong>{' '}
          <a
            href="https://github.com/Hombre2014/job-tracker-extension"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://github.com/Hombre2014/job-tracker-extension
          </a>
        </li>
      </ul>
      <h3 className="mt-4 text-xl font-bold">Data Protection Officer</h3>
      <p className="mb-8 mt-2">
        Under GDPR Article 37, we are not required to appoint a Data Protection
        Officer because:
      </p>
      <ul className="list-disc list-inside flex flex-col pl-4 my-4">
        <li className="mb-2">We are not a public authority</li>
        <li className="mb-2">
          We do not engage in large-scale processing of special categories of
          data
        </li>
        <li className="mb-2">We do not engage in large-scale systematic monitoring</li>
      </ul>
      <p className="mb-8 mt-2">
        However, for all privacy-related inquiries, you can contact us through
        the GitHub Issues page above, and we will respond within 30 days as
        required by GDPR Article 12.
      </p>
      <h2 className="text-2xl font-bold mt-8">Third-Party Terms of Service</h2>
      <p className="mb-8 mt-2">
        <strong>Important Disclaimer:</strong>
      </p>
      <p className="mb-8 mt-2">
        This extension extracts job posting data from LinkedIn, Indeed, and
        other job sites when you manually visit those pages. While we believe
        this user-initiated, personal use extraction falls within fair use,
        these platforms have their own Terms of Service that may restrict
        automated data extraction.
      </p>
      <h3 className="mt-4 text-xl font-bold">User Responsibility</h3>
      <ul className="list-disc list-inside flex flex-col pl-4 my-4">
        <li className="mb-2">
          You are solely responsible for complying with the Terms of Service of
          LinkedIn, Indeed, and any other websites you use with this extension
        </li>
        <li className="mb-2">
          This extension is intended for <strong>personal use only</strong> to
          help you organize your job search
        </li>
        <li className="mb-2">
          Do not use this extension to build competing services, aggregate data
          for commercial purposes, or violate any third-party terms
        </li>
        <li className="mb-2">
          The use of this extension does not constitute authorization from
          LinkedIn, Indeed, or any other platform to extract their data
        </li>
      </ul>
      <h3 className="mt-4 text-xl font-bold">Legal Position</h3>
      <ul className="list-disc list-inside flex flex-col pl-4 my-4">
        <li className="mb-2">
          This extension facilitates user-initiated extraction of publicly
          visible data that you are already viewing
        </li>
        <li className="mb-2">
          No automated crawling, bulk extraction, or bot activity is performed
        </li>
        <li className="mb-2">
          All extracted data is saved to your personal account only and is not
          redistributed
        </li>
      </ul>
      <p className="mb-8 mt-2">
        By using this extension, you acknowledge that you have read and
        understand the Terms of Service of the job sites you visit, and you
        agree to use this extension in compliance with those terms.
      </p>
      <h2 className="text-2xl font-bold mt-8">Consent and Agreement</h2>
      <h3 className="mt-4 text-xl font-bold">Installing This Extension</h3>
      <ol className="list-decimal list-inside flex flex-col pl-4 my-4">
        <li className="mb-2">
          <strong>Informed</strong>: You have access to this Privacy Policy
          explaining all data processing
        </li>
        <li>
          <strong>Making an Active Choice</strong>: Installation is a deliberate
          action, not passive acceptance
        </li>
        <li>
          <strong>Providing Specific Consent</strong>: For the specific purpose
          of saving and organizing job postings
        </li>
        <li>
          <strong>Able to Withdraw Easily</strong>: Uninstalling the extension
          withdraws consent and stops all processing
        </li>
      </ol>
      <p className="mb-8 mt-2">
        This constitutes valid consent under GDPR Article 7 (freely given,
        specific, informed, and unambiguous consent).
      </p>
      <h3 className="mt-4 text-xl font-bold">Using the Extension</h3>
      <p className="mb-8 mt-2">
        By actively using features of this extension (clicking &quot;Quick
        Save,&quot; typing in search fields, etc.), you reaffirm your consent to
        the data processing necessary for those features.
      </p>
      <h3 className="mt-4 text-xl font-bold">Withdrawing Consent</h3>
      <ul className="list-disc list-inside flex flex-col pl-4 my-4">
        <li className="mb-2">Uninstalling the extension (stops all processing immediately)</li>
        <li className="mb-2">Deleting your Job Tracker account (removes all saved data)</li>
        <li className="mb-2">Not using optional features (e.g., company autocomplete)</li>
      </ul>
      <p className="mb-8 mt-2">
        Withdrawing consent does not affect the lawfulness of processing before
        withdrawal.
      </p>
      <h2 className="text-2xl font-bold mt-8">Compliance</h2>
      <ul className="list-disc list-inside flex flex-col pl-4 my-4">
        <li className="mb-2">Chrome Web Store Developer Program Policies</li>
        <li className="mb-2">
          General Data Protection Regulation (GDPR) Articles 6, 7, 13, and 15-22
        </li>
        <li className="mb-2">ePrivacy Directive</li>
        <li className="mb-2">California Consumer Privacy Act (CCPA) where applicable</li>
        <li className="mb-2">Applicable data protection laws</li>
      </ul>
    </div>
  );
}
