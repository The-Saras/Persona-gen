import axios from "axios";
import { AiModelProvider } from "./AiModelProvider";

export class OpenaiProvider implements AiModelProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generatePersona(topic: string): Promise<string> {
    const prompt = `
You are an expert business analyst with browsing enabled.

Before generating the persona, you MUST follow this strict order:

# 🔍 PRIMARY RULES (Critical)
1. FIRST visit and extract information ONLY from the URLs listed below.  
2. ONLY IF relevant info about the target company is NOT found here, you may use your internal model knowledge.  
3. Prefer press releases, official announcements, financial results, and news articles.  
4. If specific data is not available, state: “Not publicly available” + a reasonable estimation.

The target company is: **${topic}**

# 🌐 HIGH-PRIORITY SOURCES (Browse These First)

## OIL & GAS COMPANIES
- ADNOC: https://www.adnoc.ae/en/news-and-media/press-releases
- ADNOC Gas: https://www.adnocgas.ae/en/news-and-media/press-releases
- Saudi Aramco: https://www.aramco.com/en/news-media
- QatarEnergy (Zawya): https://www.zawya.com/en/projects/oil-and-gas/qatarenergy-signs-agreement-for-guyana-offshore-exploration-block-m79fgf48
- Kuwait Oil Company (KOC): https://www.oilandgasmiddleeast.com
- OQ (Oman): https://totalenergies.com/news/press-releases/oman-totalenergies-and-oqep-break-ground-marsa-lng
- Dana Gas: https://www.danagas.com/media/press-releases/
- Crescent Petroleum: https://www.ief.org/ief-news/press-releases
- SNOC: https://timesofindia.indiatimes.com/world/middle-east/uae-sharjah-discovers-fifth-onshore-gas-field-at-al-hadiba/articleshow/125088258.cms
- Halliburton: https://www.halliburton.com/en/about-us/press-release
- Gulfsands Petroleum: https://gulfsands.com/category/news-releases/
- Lamprell: https://www.lamprell.com/news-press-releases/
- Wood Plc Middle East: https://www.woodplc.com/company/where-we-operate/locations/middle-east
- Flowserve Middle East: https://ir.flowserve.com/news-events/news-details/2024/Flowserve-Corporation-Receives-Two-Significant-Middle-East-Project-Awards-04-23-2024/default.aspx
- MEYER Middle East: https://www.meyernow.com/news-and-blog/meyer-middle-east-press-release.html
- ITT (Saudi Facility): https://www.businesswire.com/news/home/20251117092236/en/ITT-Expands-Engineering-and-Manufacturing-Site-in-Saudi-Arabia
- OQEP: https://totalenergies.com/news/press-releases/oman-totalenergies-and-oqep-break-ground-marsa-lng
- TechnipFMC: https://www.technipfmc.com/en/media/press-releases/
- Gulf Oil & Gas Portal: https://www.gulfoilandgas.com/webpro1/main/newslist.asp?id=ME
- Oil & Gas Middle East: https://www.oilandgasmiddleeast.com/news

## EPC COMPANIES
- NPCC: https://www.oilandgasmiddleeast.com
- NMDC Energy: https://www.nmdc.com/en/media/press-releases
- CCC: https://www.ccc.net/media-center/news
- L&T Hydrocarbon: https://www.larsentoubro.com/press-releases
- Technip Energies: https://www.technipenergies.com/media/press-releases
- Saipem ME: https://www.saipem.com/en/media/press-releases
- Petrofac: https://www.petrofac.com/media/news/
- McDermott: https://www.mcdermott.com/Newsroom
- KBR Middle East: https://www.kbr.com/en/insights-news
- Worley Middle East: https://www.worley.com/news
- Bilfinger Middle East: https://www.bilfinger.com/en/media/news/
- JGC: https://www.jgc.com/en/news/
- Samsung Engineering: https://www.samsungengineering.com/global/en/newsroom/
- Hyundai Engineering: https://www.hec.co.kr/eng/media/news/index.do
- Energy China: https://www.ceec.net.cn/ceecen/media/news/
- Kent: https://www.kentplc.com/news
- Rotary Engineering: https://www.rotaryeng.com/news
- Nesma & Partners: https://www.nesma-partners.com/news
- Dayim PunjLloyd: http://www.dayimpunjlloyd.com/news
- Al-Rushaid Construction: https://www.alrcc.com/media

## FACILITIES MANAGEMENT / MAINTENANCE
- Imdaad: https://www.imdaad.ae/news/
- EFS: https://www.efsme.com/news/
- Farnek: https://www.farnek.com/media/
- Transguard: https://www.transguardgroup.com/news
- Enova: https://www.enova-me.com/media-center/
- MMG: https://www.mmg.com.sa/
- ACIC: https://ognnews.com/Article/47688/ACIC_Pioneering_high_quality_industrial_maintenance_in_Saudi_Arabia
- NOMAC: https://www.nomac.com/media-center/
- Al Bonian FM: https://albonianfm.com/news/
- Khidmah: https://www.khidmah.com/news
- Al Shirawi FM: https://www.alshirawifm.com/news-and-events/
- Apleona: https://www.apleona.com/en/news/
- Emrill: https://www.emrill.com/media-centre/
- ENGIE (Qatar): https://www.engie.com/news
- MAB FM: https://www.mab.ae/media/
- Arabian Maintenance Co: https://www.linkedin.com/company/arabian-maintenance-company/
- GIF Maintenance: https://gif-maintenance.ae/blog/
- Olayan Descon: https://www.olayandescon.com/news
- Al Hoty Co: https://www.alhoty.com.sa/
- Nesma Industrial Services: https://www.nesma-partners.com/news

## MANUFACTURING COMPANIES
- Zamil Steel: https://www.zamilsteel.com/peb/en/press-releases.php
- Nestlé Saudi Arabia: https://www.nestle-mena.com/en/media/pressreleases/allpressreleases/nestle-signs-agreement-modon-establish-its-first-food-factory-saudi-arabia-270
- L&T Valves Arabia: https://www.larsentoubro.com/pressreleases/2024/05/16-lt-valves-opens-new-manufacturing-facility-in-saudi-arabia/
- GROHE / LIXIL: https://newsroom.lixil.com/20240905_saudi
- Alat – Lenovo: https://news.lenovo.com/pressroom/press-releases/enovo-break-ground-on-new-manufacturing-facility-in-the-kingdom-of-saudi-arabia/
- Jindal Saw Gulf Expansion: https://www.businessworld.in/article/jindal-saw-to-expand-in-gulf-with-new-uae-subsidiary-saudi-joint-ventures-559277
- Julphar: https://www.julphar.net/en/gulf-pharmaceutical-industries-julphar-announces-divestment-of-zahrat-al-rawdah-pharmacies-llc
- Gulf Cryo: https://en.wikipedia.org/wiki/Gulf_Cryo
- IFFCO Group: https://en.wikipedia.org/wiki/IFFCO_Group
- Metal Park: https://en.wikipedia.org/wiki/Metal_Park
- ITT (KSA): https://www.businesswire.com/news/home/20251117092236/en/ITT-Expands-Engineering-and-Manufacturing-Site-in-Saudi-Arabia-with-%2425-Million-Investment
- PV Hardware Middle East: https://pvhardware.com/en/press-releases/pvh-opens-its-first-manufacturing-middle-east-branch-in-saudi-arabia/
- Foxconn FIT Saudi JV: https://www.reuters.com/world/asia-pacific/foxconn-interconnects-saudi-jv-start-building-middle-east-factory-december-2025-09-17/
- CoMira Diagnostics: https://www.prnewswire.com/news-releases/co-diagnostics-signs-definitive-agreement-with-arabian-eagle-in-the-kingdom-of-saudi-arabia-to-establish-comira-diagnostics-and-localize-co-dx-pcr-platform-across-the-middle-east-302594661.html
- Farabi Petrochemicals: https://en.wikipedia.org/wiki/Farabi_Petrochemicals
- Essar Steel KSA: https://www.essar.com/inthenews/essar-to-start-work-on-4-billion-saudi-steel-plant-from-2024/
- Kirby Building Systems: https://www.prnewswire.com/ae/news-releases/alghanim-industries-expands-saudi-arabias-industrial-export-power-with-new-kirby-facility-302380162.html
- HP Manufacturing KSA: https://www.zawya.com/en/press-release/companies-news/hp-commences-operations-at-first-global-tech-manufacturing-facility-in-saudi-arabia-f5g0uf0t
- Gulf Precast: https://www.zawya.com/en/press-release/companies-news/zaif-bin-darwish-acquires-gulf-precast-strengthening-its-leadership-in-the-construction-sector-dx6m9jzv
- Triangular Pyramid Factory: https://en.wikipedia.org/wiki/Triangular_Pyramid_Factory


# 📘 Now Generate the Persona
Follow EXACTLY this structure:

1. **Company Overview**
2. **Products & Services**
3. **Vision, Mission & Strategic Focus**
4. **Future Plans**
5. **Investors & Management**
6. **Financial Snapshot**
7. **Business & Industry Challenges**
8. **Persona Interpretation**
9. **Scoring Breakdown (0–100)**

Format using clean text.
`;


    try {
      const url =
        "https://terracez-sales-ai.cognitiveservices.azure.com/openai/deployments/gpt-5-mini/chat/completions?api-version=2025-01-01-preview";
      const response = await axios.post(
        url,
        {
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_completion_tokens: 16384,
          model: "gpt-5-mini",
        },
        {
          headers: {
            "api-key": this.apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data?.choices?.[0]?.message?.content;
    } catch (error: any) {
      console.error("API error:", error.response?.data || error.message);
      throw new Error("Failed to generate persona");
    }
  }
}
