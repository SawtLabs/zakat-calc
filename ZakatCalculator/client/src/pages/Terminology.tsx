import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import IslamicPattern from "@/components/IslamicPattern";
import { THRESHOLDS, RATES, formatCurrency } from "@/lib/zakat";

const goldThresholdInINR = THRESHOLDS.GOLD.value * RATES.GOLD_PER_GRAM;
const silverThresholdInINR = THRESHOLDS.SILVER.value * RATES.SILVER_PER_GRAM;

type Language = "english" | "roman";

const terms = {
  english: [
    {
      term: "What is Zakat",
      definition: "An obligatory annual charity that Muslims must pay on their wealth, typically 2.5% of their eligible assets.",
      hadith: "Islam is built upon five pillars: testifying that there is no god but Allah and that Muhammad is the Messenger of Allah, establishing prayer, paying Zakat, performing Hajj, and fasting in Ramadan. (Bukhari & Muslim)"
    },
    {
      term: "Who Must Pay Zakat",
      definition: "Every sane, adult Muslim who owns wealth above the Nisab threshold for one lunar year.",
      hadith: "Take Zakat from their wealthy and give it to their poor. (Bukhari)"
    },
    {
      term: "Items Subject to Zakat",
      definition: [
        "1. Gold (minimum " + THRESHOLDS.GOLD.value + "g)",
        "2. Silver (minimum " + THRESHOLDS.SILVER.value + "g)",
        "3. Cash and liquid assets",
        "4. Business inventory",
        "5. Real estate bought for trading",
        "6. Agricultural produce",
        "7. Livestock",
        "8. Committee installments",
        "9. Recoverable loans given to others",
        "10. Insurance and prize bond principal amounts",
        "11. Shares",
        "12. Grazing animals"
      ].join("\n"),
      hadith: "The Prophet (ﷺ) used to order us to pay Zakat on what we prepared for trade. (Abu Dawood)"
    },
    {
      term: "Items Exempt from Zakat",
      definition: [
        "1. Personal residence",
        "2. Vehicle for personal use",
        "3. Clothes and household items",
        "4. Tools for work",
        "5. Essential life necessities",
        "6. Outstanding loans you need to pay",
        "7. Utility bills",
        "8. Employee salaries to be paid"
      ].join("\n"),
      hadith: "No charity is due from a Muslim on his slave or horse. (Bukhari)"
    },
    {
      term: "Gold Threshold",
      definition: `The minimum amount of gold (${THRESHOLDS.GOLD.value} grams, equivalent to 7.5 tola) that must be owned before Zakat becomes obligatory. Current value: ${formatCurrency(goldThresholdInINR)}.`,
      hadith: "No Zakat is payable on less than twenty dinars of gold. (Bukhari)"
    },
    {
      term: "Silver Threshold",
      definition: `The minimum amount of silver (${THRESHOLDS.SILVER.value} grams, equivalent to 52.5 tola) that must be owned before Zakat becomes obligatory. Current value: ${formatCurrency(silverThresholdInINR)}.`,
      hadith: "No Zakat is due on less than 5 awsuq of silver. (Bukhari)"
    },
    {
      term: "Consequences of Not Paying Zakat",
      definition: [
        "1. Denial of Zakat makes one a disbeliever",
        "2. Severe punishment on the Day of Judgment",
        "3. Can lead to drought and economic hardship",
        "4. Will be among the people of Hellfire",
        "5. Paying Zakat removes sins and elevates status"
      ].join("\n"),
      hadith: [
        "Those who hoard gold and silver and do not spend it in Allah's way, give them the news of a painful punishment. (At-Tawba 34-35)",
        "A community that withholds Zakat will be afflicted with drought. (Tabrani)",
        "The one who denies Zakat will be in Hellfire. (Kanz-ul-Ummal 6/131)"
      ].join("\n\n")
    },
    {
      term: "Recipients of Zakat",
      definition: [
        "1. The poor and needy",
        "2. Those in debt",
        "3. New Muslims who are in need",
        "4. Travelers in difficulty",
        "5. Those working to collect and distribute Zakat",
        "6. Prisoners",
        "7. Those striving in Allah's cause",
        "8. Those whose hearts are to be reconciled"
      ].join("\n"),
      hadith: "Zakat is only for the poor, the needy, those who collect it, those whose hearts are to be reconciled, freeing of slaves, those in debt, in the cause of Allah, and the wayfarer. (At-Tawba 60)"
    }
  ],
  roman: [
    {
      term: "Zakat Kya Hai",
      definition: "Har saal ada kiya jane wala farz sadqa jo Musalmanon par unki daulat par wajib hai, aam taur par 2.5% ki shurah se.",
      hadith: "Islam 5 cheezon par qaim hai: La ilaha illallah Muhammadur Rasulullah ki gawahi dena, namaz qaim karna, zakat ada karna, Hajj karna aur Ramzan ke roze rakhna. (Bukhari o Muslim)"
    },
    {
      term: "Zakat Kis Par Wajib Hai",
      definition: "Har aqil, baligh, maal-dar Musalman mard ya aurat par zakat wajib hai, bashart yeh ke woh sahib-e-nisab ho.",
      hadith: "Un ke ameer logon se zakat lo aur un ke ghareeb logon ko do. (Bukhari)"
    },
    {
      term: "Zakat Kin Cheezon Par Wajib Hai",
      definition: [
        `1. Sona (kam az kam ${THRESHOLDS.GOLD.value} gram)`,
        `2. Chandi (kam az kam ${THRESHOLDS.SILVER.value} gram)`,
        "3. Naqdi ya Naqd Pazeer Dastawizaat",
        "4. Maal Tijarat",
        "5. Tijarat ke liye kharida gaya plot",
        "6. Karobari niyat se kharidi gayi tamam cheezein",
        "7. Committee ki jama karai gayi aqsaat",
        "8. Diya gaya qarz jiska wapas milne ka imkaan ho",
        "9. Insurance aur prize bond ki asal raqam",
        "10. Shares",
        "11. Zameen ki paidawar",
        "12. Bahar charne wale janwar"
      ].join("\n"),
      hadith: "Nabi (ﷺ) humein tijarat ke liye tayyar kiye gaye maal par zakat dene ka hukm dete the. (Abu Dawood)"
    },
    {
      term: "In Cheezon Par Zakat Wajib Nahi",
      definition: [
        "1. Rehne ka makan",
        "2. Istemaal ki gaariyan",
        "3. Pehnne ke kapray",
        "4. Zaroorat se zyada samaan jo tijarat ke liye na ho",
        "5. Zarooriyat-e-Zindagi",
        "6. Wajib-ul-Ada qarzay",
        "7. Utility bills",
        "8. Mulazimeen ki tankhwain"
      ].join("\n"),
      hadith: "Musalman par uske ghulam aur ghore par koi zakat wajib nahi. (Bukhari)"
    },
    {
      term: "Sone Ki Nisaab",
      definition: `Sone ki wo miqdar (${THRESHOLDS.GOLD.value} gram, yani saadhay 7 tola) jis se kam par zakat wajib nahi. Maujuda qeemat: ${formatCurrency(goldThresholdInINR)}.`,
      hadith: "Bees dinar (87.48 gram sona) se kam par koi zakat nahi. (Bukhari)"
    },
    {
      term: "Chandi Ki Nisaab",
      definition: `Chandi ki wo miqdar (${THRESHOLDS.SILVER.value} gram, yani saadhay 52 tola) jis se kam par zakat wajib nahi. Maujuda qeemat: ${formatCurrency(silverThresholdInINR)}.`,
      hadith: "Paanch awqiya (612.36 gram chandi) se kam par koi zakat nahi. (Bukhari)"
    },
    {
      term: "Zakat Ada Na Karne Ka Wabal",
      definition: [
        "1. Zakat ka inkaar karne wala kafir hai",
        "2. Qiyamat ke din sakht azaab diya jayega",
        "3. Zakat ada na karne wali qaum qahat-sali ka shikar ho jati hai",
        "4. Zakat ka munkir qiyamat ke din jahannam mein hoga",
        "5. Zakat ada karne wale qiyamat ke din har qisam ke gham aur khauf se mehfooz honge"
      ].join("\n"),
      hadith: [
        "Jo log sona aur chandi jama karte hain aur use Allah ki raah mein kharch nahi karte, unhen dardnaak azaab ki khabar do. (At-Tawba 34-35)",
        "Zakat ada na karne wali qaum qahat-sali ka shikar ho jati hai. (Tabrani)",
        "Zakat ka munkir qiyamat ke din jahannam mein hoga. (Kanz-ul-Ummal 6/131)"
      ].join("\n\n")
    },
    {
      term: "Zakat Ke Mustahiq",
      definition: [
        "1. Masakeen (Hajatmand)",
        "2. Ghareeb",
        "3. Zakat wasool karne wale numayinday",
        "4. Maqrooz",
        "5. Naya Muslim jo ghareeb ho",
        "6. Qaidi",
        "7. Mujahideen",
        "8. Musafir jo filhal nisab ka malik na ho"
      ].join("\n"),
      hadith: "Zakat sirf faqeeron, miskeenon, zakat ke aamleen, jinki taleef-e-qalbi maqsood ho, ghulamon ki azadi, qarz-daaron, Allah ki raah mein aur musafiron ke liye hai. (At-Tawba 60)"
    }
  ]
};

export default function Terminology() {
  const [language, setLanguage] = useState<Language>("english");

  return (
    <div className="space-y-6 py-6">
      <IslamicPattern />

      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Islamic Terminology</h1>
        <p className="mt-2 text-gray-600">
          Essential concepts and references for understanding Zakat
        </p>
      </div>

      <div className="w-full max-w-xs mx-auto mb-6">
        <Select
          value={language}
          onValueChange={(value) => setLanguage(value as Language)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="roman">Roman Urdu</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="bg-yellow-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-yellow-800">
              Note: Gold and silver values are based on current market rates and should be verified with local authorities or scholars.
            </p>
          </div>

          <Accordion type="single" collapsible>
            {terms[language].map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-bold">
                  {item.term}
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p className="text-gray-600 whitespace-pre-line">{item.definition}</p>
                  <div className="bg-green-50 p-4 rounded-md">
                    <p className="text-sm italic text-gray-700 whitespace-pre-line">
                      {item.hadith}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}