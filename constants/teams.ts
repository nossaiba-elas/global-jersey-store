export interface TeamData {
  name: string;
  countryCode: string;
  flag: string;
  brand: string;
  primaryColor: string;
  secondaryColor: string;
  stillInCompetition: boolean;
  stage: string;
  jerseyImage: string;
}

// Simulated live World Cup bracket data — swap for a real API later if desired.
export const CURRENT_STAGE = "Quarter-Finals";

export const TEAMS: TeamData[] = [
  { name: "Morocco", countryCode: "MA", flag: "🇲🇦", brand: "Puma", primaryColor: "#C1272D", secondaryColor: "#006233", stillInCompetition: true, stage: "Quarter-Finals", jerseyImage: "https://media.base44.com/images/public/6a4c45f2af184c1dded6de42/acc1f2069_generated_image.png" },
  { name: "France", countryCode: "FR", flag: "🇫🇷", brand: "Nike", primaryColor: "#002395", secondaryColor: "#ED2939", stillInCompetition: true, stage: "Quarter-Finals", jerseyImage: "https://media.base44.com/images/public/6a4c45f2af184c1dded6de42/9acedf6b0_generated_image.png" },
  { name: "Argentina", countryCode: "AR", flag: "🇦🇷", brand: "Adidas", primaryColor: "#75AADB", secondaryColor: "#FFFFFF", stillInCompetition: true, stage: "Quarter-Finals", jerseyImage: "https://media.base44.com/images/public/6a4c45f2af184c1dded6de42/14a3b6a3b_generated_image.png" },
  { name: "Portugal", countryCode: "PT", flag: "🇵🇹", brand: "Nike", primaryColor: "#046A38", secondaryColor: "#DA020E", stillInCompetition: true, stage: "Quarter-Finals", jerseyImage: "https://media.base44.com/images/public/6a4c45f2af184c1dded6de42/56718f024_generated_image.png" },
  { name: "Brazil", countryCode: "BR", flag: "🇧🇷", brand: "Nike", primaryColor: "#FFDF00", secondaryColor: "#009739", stillInCompetition: true, stage: "Quarter-Finals", jerseyImage: "https://media.base44.com/images/public/6a4c45f2af184c1dded6de42/9a7a4b658_generated_image.png" },
  { name: "England", countryCode: "GB-ENG", flag: "🏴", brand: "Nike", primaryColor: "#FFFFFF", secondaryColor: "#CE1124", stillInCompetition: true, stage: "Quarter-Finals", jerseyImage: "https://media.base44.com/images/public/6a4c45f2af184c1dded6de42/8892d4749_generated_image.png" },
  { name: "Netherlands", countryCode: "NL", flag: "🇳🇱", brand: "Nike", primaryColor: "#FF7900", secondaryColor: "#21468B", stillInCompetition: true, stage: "Quarter-Finals", jerseyImage: "https://media.base44.com/images/public/6a4c45f2af184c1dded6de42/d85d75aea_generated_image.png" },
  { name: "Germany", countryCode: "DE", flag: "🇩🇪", brand: "Adidas", primaryColor: "#000000", secondaryColor: "#DD0000", stillInCompetition: true, stage: "Quarter-Finals", jerseyImage: "https://media.base44.com/images/public/6a4c45f2af184c1dded6de42/9946b133f_generated_image.png" },
  { name: "Canada", countryCode: "CA", flag: "🇨🇦", brand: "Nike", primaryColor: "#FF0000", secondaryColor: "#FFFFFF", stillInCompetition: false, stage: "Round of 16", jerseyImage: "https://media.base44.com/images/public/6a4c45f2af184c1dded6de42/061098ee7_generated_image.png" },
  { name: "Spain", countryCode: "ES", flag: "🇪🇸", brand: "Adidas", primaryColor: "#AA151B", secondaryColor: "#F1BF00", stillInCompetition: false, stage: "Round of 16", jerseyImage: "https://media.base44.com/images/public/6a4c45f2af184c1dded6de42/2baebaa07_generated_image.png" },
  { name: "Belgium", countryCode: "BE", flag: "🇧🇪", brand: "Adidas", primaryColor: "#000000", secondaryColor: "#FAE042", stillInCompetition: false, stage: "Round of 16", jerseyImage: "https://media.base44.com/images/public/6a4c45f2af184c1dded6de42/b6bd6eb7a_generated_image.png" },
  { name: "Japan", countryCode: "JP", flag: "🇯🇵", brand: "Adidas", primaryColor: "#00308F", secondaryColor: "#FFFFFF", stillInCompetition: false, stage: "Round of 16", jerseyImage: "https://media.base44.com/images/public/6a4c45f2af184c1dded6de42/0b932424f_generated_image.png" },
  { name: "Italy", countryCode: "IT", flag: "🇮🇹", brand: "Adidas", primaryColor: "#0068A8", secondaryColor: "#FFFFFF", stillInCompetition: false, stage: "Round of 16", jerseyImage: "https://media.base44.com/images/public/6a4c45f2af184c1dded6de42/3f6c0cc78_generated_image.png" },
  { name: "Mexico", countryCode: "MX", flag: "🇲🇽", brand: "Adidas", primaryColor: "#006847", secondaryColor: "#CE1126", stillInCompetition: false, stage: "Round of 16", jerseyImage: "https://media.base44.com/images/public/6a4c45f2af184c1dded6de42/0ad27fd8e_generated_image.png" },
  { name: "USA", countryCode: "US", flag: "🇺🇸", brand: "Nike", primaryColor: "#0A3161", secondaryColor: "#B31942", stillInCompetition: false, stage: "Round of 16", jerseyImage: "https://media.base44.com/images/public/6a4c45f2af184c1dded6de42/1b77744f5_generated_image.png" },
  { name: "Croatia", countryCode: "HR", flag: "🇭🇷", brand: "Nike", primaryColor: "#FF0000", secondaryColor: "#FFFFFF", stillInCompetition: false, stage: "Round of 16", jerseyImage: "https://media.base44.com/images/public/6a4c45f2af184c1dded6de42/8aafb315d_generated_image.png" },
];
