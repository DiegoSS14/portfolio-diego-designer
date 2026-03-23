export interface PortfolioOwnerProfile {
  ownerName: string;
  businessStatement: string;
  businessKeywords: string[];
  whatsappUrl: string;
  instagramUrl: string;
}

export const portfolioOwnerProfile: PortfolioOwnerProfile = {
  ownerName: "Diego Sousa",
  businessStatement: "MARCAS CLARAS. EXPERIENCIAS MEMORAVEIS.",
  businessKeywords: [
    "Estrategia",
    "Identidade Visual",
    "Minimalismo",
    "Direcao Criativa",
  ],
  whatsappUrl:
    "https://wa.me/5511999999999?text=Oi%20Diego%20Sousa%2C%20quero%20conversar%20sobre%20um%20projeto.",
  instagramUrl: "https://www.instagram.com/diegosousa",
};
