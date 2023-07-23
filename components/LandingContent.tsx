"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const testimonials = [
  {
    name: "Sam altman",
    avatar: "A",
    title: "CEO at OpenAI",
    description: "This is the best AI Tool made out of OpenAI.",
  },
  {
    name: "Mark",
    avatar: "M",
    title: "CEO",
    description:
      "This app has changed my life, cannot imagine working without it!",
  },
  {
    name: "Mary",
    avatar: "M",
    title: "CFO",
    description:
      "The best in class, definitely worth the premium subscription!",
  },
  {
    name: "Joel",
    avatar: "J",
    title: "Software Engineer",
    description: "This is the best application I've ever used!",
  },
];

export const LandingContent = () => {
  return (
    <div className="px-10 pb-20">
      <h2 className="text-center text-4xl text-white font-extrabold mb-10">
        Testimonials
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {testimonials.map((item) => (
          <Card
            className="bg-[#192339] border-none text-white"
            key={item.description}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-x-2">
                <div className="flex items-center justify-center w-12 h-12 mr-2 rounded-full bg-black/10">
                  <p className="text-sm">{item.avatar}</p>
                </div>
                <div>
                  <p className="text-lg">{item.name}</p>
                  <p className="text-zinc-400 text-sm">{item.title}</p>
                </div>
              </CardTitle>
              <CardContent className="pt-4 px-0">
                {item.description}
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};
