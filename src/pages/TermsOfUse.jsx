import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function TermsOfUse() {
  const navigate = useNavigate();
  return (
    <div className="px-5 pt-6 pb-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#16213E] text-white">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-white text-xl font-extrabold">Terms &amp; Conditions</h1>
      </div>
      <div className="bg-[#16213E] rounded-3xl p-5 text-white/70 text-sm leading-relaxed space-y-4">
        <p className="text-white/40 text-xs">Last updated: August 8, 2026</p>

        <p>
          These Terms &amp; Conditions ("Terms") govern your use of the PlateCraft mobile
          application ("PlateCraft," the "app," or the "Service") provided by PlateCraft ("we,"
          "us," or "our"). By creating an account or using the Service, you agree to these
          Terms. If you do not agree, do not use the Service.
        </p>

        <div>
          <h2 className="text-white font-bold text-sm mb-1">1. Eligibility</h2>
          <p>
            You must be at least 13 years old to use PlateCraft. By using the Service, you
            represent that you meet this requirement and that you have the legal capacity to
            enter into these Terms under the laws of your jurisdiction.
          </p>
        </div>

        <div>
          <h2 className="text-white font-bold text-sm mb-1">2. Your Account</h2>
          <p>
            You sign in through Google or Apple. You are responsible for keeping your
            sign-in credentials and connected account secure, and for all activity under your
            account. If you believe your account has been compromised, contact us immediately
            and revoke the connection from your Google or Apple account settings.
          </p>
        </div>

        <div>
          <h2 className="text-white font-bold text-sm mb-1">3. The Service and Nutrition Information</h2>
          <p>
            PlateCraft helps you log foods, calculate calorie and macronutrient targets, build
            meals, generate meal-prep suggestions with AI, and scan barcodes to look up product
            nutrition. The nutrition data, calorie calculations, and AI-generated meal ideas
            are provided for general informational and wellness purposes only. They are not
            medical advice, a diagnosis, or a treatment plan, and they may not be accurate,
            complete, or appropriate for your individual needs.
          </p>
          <p>
            Always consult a qualified healthcare professional before making changes to your
            diet, exercise routine, or health practices, especially if you have a medical
            condition, are pregnant or nursing, take medication, or are managing an allergy.
            Do not rely on PlateCraft as your sole source of nutrition or health information.
          </p>
        </div>

        <div>
          <h2 className="text-white font-bold text-sm mb-1">4. Acceptable Use</h2>
          <p>
            You agree not to misuse the Service, including by: providing false or inaccurate
            information; attempting to access another user's data; interfering with or
            disrupting the Service; reverse-engineering, scraping, or reselling data obtained
            from PlateCraft; using the Service for any unlawful purpose; or uploading content
            that infringes the rights of others. Food data returned by USDA FoodData Central
            and Open Food Facts is owned by those sources and is provided for your personal use
            only.
          </p>
        </div>

        <div>
          <h2 className="text-white font-bold text-sm mb-1">5. AI-Generated Content</h2>
          <p>
            Meal-prep suggestions and any AI-generated output are produced by a third-party
            language model based on foods you have previously logged. AI output may contain
            errors, suggest portions that do not match your goals, or combine foods in
            unexpected ways. You are responsible for reviewing any suggestion before relying
            on it, and for verifying ingredient safety if you have allergies or dietary
            restrictions.
          </p>
        </div>

        <div>
          <h2 className="text-white font-bold text-sm mb-1">6. Third-Party Services</h2>
          <p>
            PlateCraft integrates with Google and Apple for sign-in, the USDA FoodData Central
            API and Open Food Facts for food and product data, and an AI provider for
            meal-prep suggestions. We are not responsible for the availability, accuracy, or
            behavior of these third-party services, and your use of their features may be
            subject to their own terms and privacy policies.
          </p>
        </div>

        <div>
          <h2 className="text-white font-bold text-sm mb-1">7. Subscriptions and Payments (if applicable)</h2>
          <p>
            If PlateCraft offers paid subscriptions or in-app purchases, purchases are
            processed by the app store or payment provider you use (for example, Google Play,
            Apple App Store, or our payment partner). Fees are billed in advance on a recurring
            basis unless cancelled. You can manage or cancel a subscription at any time through
            your app store or payment provider account. Subscriptions remain active until the
            end of the current paid period. Refunds, if any, are governed by the relevant
            store's refund policy.
          </p>
        </div>

        <div>
          <h2 className="text-white font-bold text-sm mb-1">8. Your Content</h2>
          <p>
            You retain ownership of the foods, meals, and other information you enter. You
            grant us a limited license to host, process, and display that information solely to
            operate the Service for you, including sending relevant portions to third-party
            services (such as the AI meal-prep provider) when you use those features. You are
            responsible for the accuracy and legality of what you enter.
          </p>
        </div>

        <div>
          <h2 className="text-white font-bold text-sm mb-1">9. Cancellation and Account Deletion</h2>
          <p>
            You may stop using PlateCraft at any time. You can delete individual foods, meals,
            and goals from within the app, and you can delete your entire account — which
            removes your data from our database — at any time using the Delete Account option
            on the Support screen, or by contacting us at the address below.
          </p>
        </div>

        <div>
          <h2 className="text-white font-bold text-sm mb-1">10. Disclaimers and Limitation of Liability</h2>
          <p>
            The Service is provided "as is" and "as available" without warranties of any
            kind. We do not guarantee that the app will be uninterrupted, error-free, secure,
            or that any nutrition data or AI suggestion is accurate or suitable for you. To the
            maximum extent permitted by law, PlateCraft and its providers are not liable for
            any indirect, incidental, special, consequential, or health-related damages
            arising from your use of the Service, including any action taken in reliance on
            nutrition calculations or AI-generated meal suggestions.
          </p>
        </div>

        <div>
          <h2 className="text-white font-bold text-sm mb-1">11. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless PlateCraft, its providers, and its
            affiliates from any claims, damages, or expenses arising from your misuse of the
            Service, your violation of these Terms, or your content.
          </p>
        </div>

        <div>
          <h2 className="text-white font-bold text-sm mb-1">12. Changes to the Service and Terms</h2>
          <p>
            We may update or modify the Service at any time. We may also revise these Terms;
            changes will be posted on this page with an updated "Last updated" date. Your
            continued use of PlateCraft after changes are posted constitutes acceptance of the
            revised Terms.
          </p>
        </div>

        <div>
          <h2 className="text-white font-bold text-sm mb-1">13. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the jurisdiction in which PlateCraft
            operates, without regard to conflict-of-law principles. Any disputes will be
            resolved in the courts located in that jurisdiction.
          </p>
        </div>

        <div>
          <h2 className="text-white font-bold text-sm mb-1">14. Contact Us</h2>
          <p>
            If you have any questions about these Terms &amp; Conditions, please contact us at{" "}
            <a href="mailto:Support@based-peptides.com" className="text-[#06D6A0] font-semibold">
              Support@based-peptides.com
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}