import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  return (
    <div className="px-5 pt-6 pb-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#16213E] text-white">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-white text-xl font-extrabold">Privacy Policy</h1>
      </div>
      <div className="bg-[#16213E] rounded-3xl p-5 text-white/70 text-sm leading-relaxed space-y-4">
        <p className="text-white/40 text-xs">Last updated: August 8, 2026</p>

        <p>
          This Privacy Policy describes how PlateCraft ("we," "us," or "our") collects, uses,
          and shares information when you use our application (the "Service"). By using
          PlateCraft, you agree to the collection and use of information in accordance with
          this policy. This policy is written to comply with Google Play's User Data and
          Data Safety requirements.
        </p>

        <div>
          <h2 className="text-white font-bold text-sm mb-1">1. Information We Collect</h2>
          <p>
            <span className="text-white font-semibold">Account information:</span> When you
            sign in with Google or Apple, we receive the email address and (where available)
            name those providers share with us, which we use to create and authenticate your
            account. We do not receive or store your Google or Apple password.
          </p>
          <p>
            <span className="text-white font-semibold">Health, nutrition, and fitness
            information:</span> The foods you save (custom and scanned), the meals you log
            (date, meal slot, food name, serving amount and unit, calories, protein, carbs,
            and fats), and the body metrics you enter in the Calorie Calculator (age, gender,
            height, weight, and activity level) together with the BMR, TDEE, daily calorie
            target, and protein/carbohydrate/fat targets we compute from them.
          </p>
          <p>
            <span className="text-white font-semibold">Camera:</span> Used only when you open
            the Scan tab to detect a barcode. The camera stream is processed on your device to
            recognize barcodes; video frames are not recorded, uploaded to, or stored on our
            servers, and the camera turns off as soon as a code is read or you leave the
            screen. You can decline camera access and enter the barcode manually instead.
          </p>
          <p>
            <span className="text-white font-semibold">Push notification tokens (optional):</span>{" "}
            If you enable push notifications, we store the subscription endpoint and keys
            required to deliver notifications to your device. These tokens are used solely to
            send notifications and do not reveal the content of your nutrition data.
          </p>
          <p>
            <span className="text-white font-semibold">Technical and usage information:</span>{" "}
            Our hosting and infrastructure provider collects standard request data such as IP
            address, device and browser type, and timestamps for the limited purposes of
            operating, securing, and maintaining the Service.
          </p>
        </div>

        <div>
          <h2 className="text-white font-bold text-sm mb-1">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide the Service's core features —
            authenticating your account, calculating your daily calorie and macro targets,
            saving and displaying your meal logs and food library, generating balanced
            meal-prep suggestions from foods you have previously logged, and scanning barcodes
            to look up product nutrition. We also use technical information to operate the
            Service, monitor reliability, prevent abuse, troubleshoot, and provide support, as
            well as to send you optional push notifications and respond to your support
            inquiries.
          </p>
        </div>

        <div>
          <h2 className="text-white font-bold text-sm mb-1">3. How We Share Your Information</h2>
          <p>
            We do not sell your personal information, and we do not share it with third
            parties for their own marketing purposes. We share information only with the
            following service providers, and only as needed to operate the feature you are
            using:
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>
              <span className="text-white font-semibold">Google and Apple Sign-In:</span> Used
              for authentication. Your name and email are shared with us through these
              providers' APIs; their handling of your data is governed by their respective
              privacy policies.
            </li>
            <li>
              <span className="text-white font-semibold">USDA FoodData Central (FDC):</span>{" "}
              When you search for a food, your search query is sent to the U.S. Department of
              Agriculture's FDC API to return matching nutrition data.
            </li>
            <li>
              <span className="text-white font-semibold">Open Food Facts:</span> When you scan
              or enter a barcode, that code is sent to the Open Food Facts public database to
              retrieve product nutrition.
            </li>
            <li>
              <span className="text-white font-semibold">AI meal-prep generation:</span> When
              you request a meal idea, the names and per-serving nutrition of foods you have
              previously logged for that meal slot, plus your daily calorie and macro targets,
              are sent to our AI provider to generate a balanced suggestion.
            </li>
            <li>
              <span className="text-white font-semibold">Hosting and infrastructure (Base44,
              our platform provider):</span> Stores your account and app data on secure
              servers and processes authentication and API requests on our behalf.
            </li>
          </ul>
          <p>
            We may also disclose information when reasonably necessary to comply with the law,
            respond to legal process, or protect the rights, property, or safety of
            PlateCraft, our users, or others.
          </p>
        </div>

        <div>
          <h2 className="text-white font-bold text-sm mb-1">4. Permissions and Your Choices</h2>
          <p>
            <span className="text-white font-semibold">Camera:</span> You can deny camera
            access in your device settings and still enter barcodes manually in the Scan tab.
          </p>
          <p>
            <span className="text-white font-semibold">Push notifications:</span> You can turn
            notifications off in your device settings at any time.
          </p>
          <p>
            <span className="text-white font-semibold">Sign-in providers:</span> You can review
            and revoke Google's or Apple's connection to PlateCraft from your Google or Apple
            account settings.
          </p>
          <p>
            <span className="text-white font-semibold">In-app data:</span> You can edit or
            delete individual foods, meal entries, and calorie goals at any time from within
            the app.
          </p>
        </div>

        <div>
          <h2 className="text-white font-bold text-sm mb-1">5. Data Security and Encryption</h2>
          <p>
            Your data is transmitted and stored using industry-standard safeguards, including
            HTTPS/TLS encryption in transit. Authentication and data storage are handled by
            our platform provider under secured configurations. No method of transmission or
            storage is 100% secure, but we take reasonable measures to protect your personal
            information.
          </p>
        </div>

        <div>
          <h2 className="text-white font-bold text-sm mb-1">6. Data Retention and Account Deletion</h2>
          <p>
            We retain your data for as long as your account is active so the app can remember
            your history. You can delete individual foods, meals, and goals at any time from
            within the app, and you can delete your entire account — which removes your foods,
            meal entries, calorie goals, and push notification tokens from our database — at
            any time using the Delete Account option on the Support screen, or by contacting
            us at the address below. Some residual data may persist in our infrastructure
            provider's backups for a limited time as part of normal operations, accessible
            only for disaster recovery.
          </p>
        </div>

        <div>
          <h2 className="text-white font-bold text-sm mb-1">7. Your Privacy Rights</h2>
          <p>
            Depending on where you live, you may have additional rights under data protection
            laws such as the GDPR (European Economic Area and UK), the CCPA (California), and
            similar laws. These rights may include accessing, correcting, deleting, or
            porting your personal data, and objecting to or restricting certain processing. To
            exercise any of these rights, please contact us at the address below. We will
            respond within the timeframe required by applicable law.
          </p>
        </div>

        <div>
          <h2 className="text-white font-bold text-sm mb-1">8. Children's Privacy</h2>
          <p>
            PlateCraft is not intended for use by children under the age of 13. We do not
            knowingly collect personal information from children under 13. If we become aware
            that we have collected such information, we will take steps to delete it.
          </p>
        </div>

        <div>
          <h2 className="text-white font-bold text-sm mb-1">9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on
            this page with an updated "Last updated" date. Your continued use of the Service
            after changes are posted constitutes acceptance of the revised policy.
          </p>
        </div>

        <div>
          <h2 className="text-white font-bold text-sm mb-1">10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or how we handle your data,
            please contact us at{" "}
            <a href="mailto:Support@based-peptides.com" className="text-[#06D6A0] font-semibold">
              Support@based-peptides.com
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}