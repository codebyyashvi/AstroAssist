import requests
from bs4 import BeautifulSoup
import json
import time

base_url = "https://www.mosdac.gov.in"
faq_main_url = f"{base_url}/faq-page"

# Step 1: Get the main FAQ page
res = requests.get(faq_main_url)
soup = BeautifulSoup(res.text, "html.parser")

faq_list = []

# Step 2: Extract question links
faq_links = soup.select("div.faq-question a")

for i, link in enumerate(faq_links):
    question = link.text.strip()
    relative_url = link.get("href")
    full_url = base_url + relative_url

    # Step 3: Visit each question page to extract answer
    try:
        ans_res = requests.get(full_url)
        ans_soup = BeautifulSoup(ans_res.text, "html.parser")

        # Extract answer - typically inside <div class="field-item even">
        answer_div = ans_soup.select_one("div.field-item.even")
        answer = answer_div.get_text(strip=True) if answer_div else "No answer found."

        faq_list.append({
            "id": f"faq_{i+1}",
            "question": question,
            "answer": answer,
            "text": f"{question}\n{answer}",
            "url": full_url
        })

        print(f"✅ Extracted FAQ {i+1}: {question}")
        time.sleep(0.5)  # respectful crawling delay

    except Exception as e:
        print(f"❌ Error on FAQ {i+1}: {e}")

# Step 4: Save to JSON
with open("mosdac_faqs_complete.json", "w", encoding="utf-8") as f:
    json.dump(faq_list, f, ensure_ascii=False, indent=2)

print(f"\n🎉 Finished! Extracted {len(faq_list)} FAQs and saved to mosdac_faqs_complete.json")
