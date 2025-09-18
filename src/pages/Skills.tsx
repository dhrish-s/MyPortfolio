import React, { useEffect, useState } from "react";
import "./Skills.css";
import { getSkills } from "../queries/getSkills";
import { Skill } from "../types";

// Icons
import {
  FaReact, FaNodeJs, FaAws, FaDocker, FaGitAlt, FaJava, FaPython, FaDatabase,
} from "react-icons/fa";
import {
  SiRubyonrails, SiTypescript, SiPostgresql, SiMysql, SiKubernetes, SiGooglecloud,
  SiSpringboot, SiPhp, SiNetlify, SiHeroku, SiHtml5, SiCss3, SiRabbitmq, SiImessage,
  SiTensorflow, SiPytorch, SiScikitlearn, SiOpencv, SiThreedotjs, SiOpengl,
  SiApachespark, SiApachekafka, SiJavascript, SiCplusplus, SiMongodb
} from "react-icons/si";

// Map by *name* (preferred for your resume terms)
const iconByName: Record<string, JSX.Element> = {
  Python: <FaPython />,
  "C++": <SiCplusplus />,
  SQL: <FaDatabase />,
  JavaScript: <SiJavascript />,
  TensorFlow: <SiTensorflow />,
  PyTorch: <SiPytorch />,
  "scikit-learn": <SiScikitlearn />,
  OpenCV: <SiOpencv />,
  AWS: <FaAws />,
  GCP: <SiGooglecloud />,
  Docker: <FaDocker />,
  Git: <FaGitAlt />,
  "Three.js": <SiThreedotjs />,
  OpenGL: <SiOpengl />,
  "Apache Spark": <SiApachespark />,
  "Apache Kafka": <SiApachekafka />,
  PostgreSQL: <SiPostgresql />,
  MongoDB: <SiMongodb />,
  React: <FaReact />,
  NodeJS: <FaNodeJs />,
};

// Back-compat: if your CMS stores the *icon component key* instead
const iconByKey: Record<string, JSX.Element> = {
  SiRubyonrails: <SiRubyonrails />,
  FaNodeJs: <FaNodeJs />,
  SiSpringboot: <SiSpringboot />,
  FaJava: <FaJava />,
  SiPhp: <SiPhp />,
  FaReact: <FaReact />,
  SiTypescript: <SiTypescript />,
  FaAws: <FaAws />,
  FaDocker: <FaDocker />,
  SiPostgresql: <SiPostgresql />,
  SiMysql: <SiMysql />,
  SiKubernetes: <SiKubernetes />,
  SiGooglecloud: <SiGooglecloud />,
  SiHeroku: <SiHeroku />,
  SiNetlify: <SiNetlify />,
  SiRabbitmq: <SiRabbitmq />,
  SiImessage: <SiImessage />,
  SiTensorflow: <SiTensorflow />,
  SiPytorch: <SiPytorch />,
  SiScikitlearn: <SiScikitlearn />,
  SiOpencv: <SiOpencv />,
  SiThreedotjs: <SiThreedotjs />,
  SiOpengl: <SiOpengl />,
  SiApachespark: <SiApachespark />,
  SiApachekafka: <SiApachekafka />,
  SiJavascript: <SiJavascript />,
  SiCplusplus: <SiCplusplus />,
  SiMongodb: <SiMongodb />,
  FaDatabase: <FaDatabase />,
  FaGitAlt: <FaGitAlt />,
};

// Preferred order for categories (others follow)
const CATEGORY_ORDER = [
  "Programming & Data",
  "ML / AI",
  "Data Engineering",
  "Visualization & 3D",
  "Cloud & DevOps",
  "Tools",
];

const Skills: React.FC = () => {
  const [skillsData, setSkillsData] = useState<Skill[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getSkills();
      setSkillsData(data);
    })();
  }, []);

  if (skillsData.length === 0) return <div>Loading...</div>;

  // Group by category
  const skillsByCategory = skillsData.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] ||= []).push(s);
    return acc;
  }, {});

  // Sort categories using preferred order
  const orderedCategories = Object.keys(skillsByCategory).sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a);
    const ib = CATEGORY_ORDER.indexOf(b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });

  return (
    <div className="skills-container">
      {orderedCategories.map((category, cIdx) => (
        <div key={category} className="skill-category">
          <h3
            className="category-title"
            style={{ animationDelay: `${0.15 * (cIdx + 1)}s` }}
          >
            {category}
          </h3>

          <div className="skills-grid">
            {skillsByCategory[category].map((skill, idx) => {
              const icon =
                iconByName[skill.name] ||
                iconByKey[skill.icon as keyof typeof iconByKey] ||
                <FaReact />;

              return (
                <div key={`${skill.name}-${idx}`} className="skill-card">
                  <div className="icon">{icon}</div>
                  <h3 className="skill-name">
                    {skill.name.split("").map((ch, i) => (
                      <span
                        key={i}
                        className="letter"
                        style={{ animationDelay: `${i * 0.05}s` }}
                      >
                        {ch}
                      </span>
                    ))}
                  </h3>
                  {skill.description && (
                    <p className="skill-description">{skill.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Skills;
