type Information = {
  title: string;
  description: string;
};

export const information: Information = {
  title: "Williamson",
  description:
    "In this blog, I share my programming learnings and experiences while continuing to develop as a web development professional.",
};

export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  description: string;

  education: {
    degree: string;
    institution: string;
    period: string;
  };
  workTools: string[];
  favoriteTools: string[];
  socials: { name: string; url: string }[];
}

export const personalInfo: PersonalInfo = {
  name: "Gabriel Duarte Williamson",
  workTools: [
    "python",
    "django",
    "postgre-sql",
    "react",
    "sass",
    "next-js",
    "payload-cms",
  ],
  favoriteTools: [
    "elixir",
    "phoenix",
    "tailwind",
    "typescript",
    "drizzle",
    "astro",
  ],
  description:
    "I am an Information Systems Engineer, graduated in 2024, and currently working as a web developer at Kronoscode. I am passionate about technology, continuous learning, and building practical solutions. Through this blog, I share ideas, experiences, and resources about programming and web development whenever I can.",
  title: "Software developer from Nicaragua",
  location: "Nicaragua",
  education: {
    degree: "Information systems engineer",
    institution: "UNAN Managua",
    period: "2020-2024",
  },

  socials: [
    { name: "GitHub", url: "https://github.com/GabrielWilliamson" },
    { name: "X", url: "https://x.com/gabr_williamson" },
  ],
};

export const domain = "https://gabrielwilliamson.com";
