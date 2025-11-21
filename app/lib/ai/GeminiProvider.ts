import { GoogleGenerativeAI } from "@google/generative-ai";
import { AiModelProvider } from "./AiModelProvider";

export class GeminiProvider implements AiModelProvider {
  private model: any;

  constructor(apiKey: string) {
    const client = new GoogleGenerativeAI(apiKey);
    this.model = client.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  async generatePersona(topic: string,inst:string): Promise<string> {
    const URL_LIST = `
Approved URLs:

OIL & GAS COMPANIES:
- https://www.adnoc.ae/en/news-and-media/press-releases
- https://www.adnocgas.ae/en/news-and-media/press-releases
- https://www.aramco.com/en/news-media
- https://www.zawya.com/en/projects/oil-and-gas/qatarenergy-signs-agreement-for-guyana-offshore-exploration-block-m79fgf48
- https://www.oilandgasmiddleeast.com
- https://totalenergies.com/news/press-releases/oman-totalenergies-and-oqep-break-ground-marsa-lng
- https://www.danagas.com/media/press-releases/
- https://www.ief.org/ief-news/press-releases
- https://timesofindia.indiatimes.com/world/middle-east/...
- https://www.halliburton.com/en/about-us/press-release
- https://gulfsands.com/category/news-releases/
- https://www.lamprell.com/news-press-releases/
- https://www.woodplc.com/company/where-we-operate/locations/middle-east
- https://ir.flowserve.com/news-events/news-details/2024/Flowserve-Corporation-Receives-Two-Significant-Middle-East-Project-Awards-04-23-2024/default.aspx
- https://www.meyernow.com/news-and-blog/meyer-middle-east-press-release.html
- https://www.businesswire.com/news/home/20251117092236/en/ITT-Expands-Engineering-and-Manufacturing-Site-in-Saudi-Arabia
- https://totalenergies.com/news/press-releases/oman-totalenergies-and-oqep-break-ground-marsa-lng
- https://www.technipfmc.com/en/media/press-releases/
- https://www.gulfoilandgas.com/webpro1/main/newslist.asp?id=ME
- https://www.oilandgasmiddleeast.com/news

EPC COMPANIES:
- https://www.oilandgasmiddleeast.com
- https://www.nmdc.com/en/media/press-releases
- https://www.ccc.net/media-center/news
- https://www.larsentoubro.com/press-releases
- https://www.technipenergies.com/media/press-releases
- https://www.saipem.com/en/media/press-releases
- https://www.petrofac.com/media/news/
- https://www.mcdermott.com/Newsroom
- https://www.kbr.com/en/insights-news
- https://www.worley.com/news
- https://www.bilfinger.com/en/media/news/
- https://www.jgc.com/en/news/
- https://www.samsungengineering.com/global/en/newsroom/
- https://www.hec.co.kr/eng/media/news/index.do
- https://www.ceec.net.cn/ceecen/media/news/
- https://www.kentplc.com/news
- https://www.rotaryeng.com/news
- https://www.nesma-partners.com/news
- http://www.dayimpunjlloyd.com/news
- https://www.alrcc.com/media

MAINTENANCE COMPANIES:
- https://www.imdaad.ae/news/
- https://www.efsme.com/news/
- https://www.farnek.com/media/
- https://www.transguardgroup.com/news
- https://www.enova-me.com/media-center/
- https://www.mmg.com.sa/
- https://ognnews.com/Article/47688/ACIC_Pioneering_high_quality_industrial_maintenance_in_Saudi_Arabia
- https://www.nomac.com/media-center/
- https://albonianfm.com/news/
- https://www.khidmah.com/news
- https://www.alshirawifm.com/news-and-events/
- https://www.apleona.com/en/news/
- https://www.emrill.com/media-centre/
- https://www.engie.com/news
- https://www.mab.ae/media/
- https://www.linkedin.com/company/arabian-maintenance-company/
- https://gif-maintenance.ae/blog/
- https://www.olayandescon.com/news
- https://www.alhoty.com.sa/
- https://www.nesma-partners.com/news

MANUFACTURING COMPANIES:
- https://www.zamilsteel.com/peb/en/press-releases.php
- https://www.nestle-mena.com/en/media/pressreleases/allpressreleases/...
- https://www.larsentoubro.com/pressreleases/2024/05/16-lt-valves-opens-new-manufacturing-facility-in-saudi-arabia/
- https://newsroom.lixil.com/20240905_saudi
- https://news.lenovo.com/pressroom/press-releases/...
- https://www.businessworld.in/article/jindal-saw-to-expand-in-gulf-with-new-uae-subsidiary-saudi-joint-ventures-559277
- https://www.julphar.net/en/gulf-pharmaceutical-industries-julphar-announces-divestment-of-zahrat-al-rawdah-pharmacies-llc
- https://en.wikipedia.org/wiki/Gulf_Cryo
- https://en.wikipedia.org/wiki/IFFCO_Group
- https://en.wikipedia.org/wiki/Metal_Park
- https://www.businesswire.com/news/home/20251117092236/en/ITT-Expands-Engineering-and-Manufacturing-Site-in-Saudi-Arabia-with...
- https://pvhardware.com/en/press-releases/pvh-opens-its-first-manufacturing-middle-east-branch-in-saudi-arabia/
- https://www.reuters.com/world/asia-pacific/foxconn-interconnects-saudi-jv-start-building-middle-east-factory-december-2025-09-17/
- https://www.prnewswire.com/news-releases/...
- https://en.wikipedia.org/wiki/Farabi_Petrochemicals
- https://www.essar.com/inthenews/essar-to-start-work-on-4-billion-saudi-steel-plant-from-2024/
- https://www.prnewswire.com/ae/news-releases/...
- https://www.zawya.com/en/press-release/companies-news/...
- https://en.wikipedia.org/wiki/Triangular_Pyramid_Factory
`;

    const SEARCH_URLS = `
Below is the list of approved URLs you MUST consult first for any company-specific facts.
Search these URLs first.  
Only if information is unavailable here, you may use your internal dataset.

${URL_LIST}
`;
    const prompt = `
You are an expert business analyst. Before answering, follow these strict rules:

1. FIRST search only inside the URLs provided below (the "Approved Search Set").
2. Extract real data from these URLs if available.
3. Only if no relevant information is found in these URLs, THEN use your model's internal knowledge.
4. ALWAYS prefer factual, traceable data from the URLs.
5. If the data is not publicly available, respond with "Not publicly available" + an estimated range.

${SEARCH_URLS}

Now generate a detailed and structured company persona.

Also take into account these additional instructions provided by the user: ${inst}

Company: ${topic}

Your output must strictly follow the structure below:

1. **Company Overview**
   - Name, Founded, Founders, HQ, Sector, 3–6 milestone history

2. **Products & Services**
   - Core offerings
   - Target market
   - Key value propositions
   - Differentiators

3. **Vision, Mission & Strategic Focus**

4. **Future & Expansion Plans**

5. **Investors, Ownership & Management**
   - Stakeholders & major investors
   - Public/private
   - Recent management or board changes

6. **Financial Snapshot**
   - Revenue, profit/loss, YoY growth, market cap, share price (if public)
   - Latest funding history
   - If real data unknown, respond with "Not publicly available" + reasonable estimation

7. **Business & Industry Challenges**
   - Internal challenges
   - Industry-level challenges

8. **Persona-Based Interpretation**
   - Persona archetype
   - Company culture summary

9. **Scoring (0–100 weighted)**
   - Sub-scores for Market Position, Innovation Ability, Scalability,
     Long-Term Stability, Competition Handling, Leadership Quality,
     Product-User Fit  
   - Show score breakdown and final weighted total.

Format everything cleanly in plain text.
`;

    const result = await this.model.generateContent(prompt);
    return result?.response?.text() ?? "";
  }
}
