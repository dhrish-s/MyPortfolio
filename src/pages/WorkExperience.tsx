import React, { useEffect, useMemo, useState } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { FaRegCalendarAlt } from "react-icons/fa"; // Calendar icon

import { MdOutlineWork as WorkIcon } from 'react-icons/md';
import { IoSchool as SchoolIcon } from 'react-icons/io5';
import {
  FaCodeBranch as ProjectIcon,
  FaFlask as ResearchIcon,
  FaAward as AwardIcon,
  FaUsers as LeaderIcon,
  FaStar as StarIcon,
} from 'react-icons/fa';

import './WorkExperience.css';
import { TimelineItem } from '../types';
import { getTimeline } from '../queries/getTimeline';

type TypeKey = 'work' | 'education' | 'project' | 'research' | 'award' | 'leadership';

const TYPE_STYLES: Record<TypeKey, { cardBg: string; iconBg: string; iconColor: string; ringGrad: string }> = {
  work:       { cardBg: 'rgba(30, 60, 114, 0.28)',  iconBg: 'linear-gradient(180deg,#1e3c72,#2a5298)', iconColor: '#fff',      ringGrad: 'linear-gradient(135deg,#5ee7df,#b490ca)' },
  education:  { cardBg: 'rgba(255, 182, 193, 0.25)', iconBg: 'linear-gradient(180deg,#ffafbd,#ffc3a0)', iconColor: '#fff',      ringGrad: 'linear-gradient(135deg,#ffecd2,#fcb69f)' },
  project:    { cardBg: 'rgba(56, 239, 125, 0.22)',  iconBg: 'linear-gradient(180deg,#11998e,#38ef7d)', iconColor: '#fff',      ringGrad: 'linear-gradient(135deg,#a8ff78,#78ffd6)' },
  research:   { cardBg: 'rgba(123, 74, 226, 0.22)',  iconBg: 'linear-gradient(180deg,#7b4ae2,#a78bfa)', iconColor: '#fff',      ringGrad: 'linear-gradient(135deg,#c471f5,#fa71cd)' },
  award:      { cardBg: 'rgba(255, 215, 0, 0.22)',   iconBg: 'linear-gradient(180deg,#f7971e,#ffd200)', iconColor: '#2b2b2b',  ringGrad: 'linear-gradient(135deg,#f6d365,#fda085)' },
  leadership: { cardBg: 'rgba(255, 255, 255, 0.14)', iconBg: 'linear-gradient(180deg,#314755,#26a0da)', iconColor: '#fff',      ringGrad: 'linear-gradient(135deg,#a1c4fd,#c2e9fb)' },
};

const normalizeType = (t?: string): TypeKey => {
  const key = (t || '').toLowerCase();
  return (['work','education','project','research','award','leadership'].includes(key) ? (key as TypeKey) : 'work');
};

const iconFor = (t: TypeKey) => {
  switch (t) {
    case 'work':       return <WorkIcon />;
    case 'education':  return <SchoolIcon />;
    case 'project':    return <ProjectIcon />;
    case 'research':   return <ResearchIcon />;
    case 'award':      return <AwardIcon />;
    case 'leadership': return <LeaderIcon />;
    default:           return <WorkIcon />;
  }
};

const WorkExperience: React.FC = () => {
  const [timeLineData, setTimeLineData] = useState<TimelineItem[] | null>(null);

  useEffect(() => {
    (async () => {
      const data = await getTimeline();
      setTimeLineData(data);
    })();
  }, []);

  const items = useMemo(() => timeLineData ?? [], [timeLineData]);

  if (!timeLineData) return <div className="wx-loading">Loading timeline…</div>;

  return (
    <>
        <div className="wx-header">
          <h2 className="wx-title">
            <FaRegCalendarAlt className="wx-icon" /> Work Experience & Education Timeline
          </h2>
          <p className="wx-subtitle">Roles, research, awards, and milestones at a glance</p>
        </div>

      <div className="wx-timeline-wrapper">
        <VerticalTimeline animate lineColor="rgba(255,255,255,0.14)">
          {items.map((item, index) => {
            const t = normalizeType(item.timelineType);
            const palette = TYPE_STYLES[t];
            const accent = (item as any)?.color || palette.ringGrad;

            return (
              <VerticalTimelineElement
                key={index}
                className={`vertical-timeline-element--${t} wx-card`}
                /* expose accent to CSS */
                style={{ ['--wx-accent' as any]: accent }}
                contentStyle={{
                  background: palette.cardBg,
                  color: '#fff',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: 18,
                  /* extra top padding to make room for the inset date chip */
                  padding: '26px 22px 18px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                }}
                contentArrowStyle={{ borderRight: '7px solid rgba(255,255,255,0.08)' }}
                /* ❗ Disable the library date rendering to avoid off-screen issues on desktop */
                date=""
                iconStyle={{
                  background: palette.iconBg,
                  color: palette.iconColor,
                  boxShadow: '0 0 0 6px rgba(255,255,255,0.06), 0 8px 20px rgba(0,0,0,0.35)',
                  border: '2px solid rgba(255,255,255,0.25)',
                }}
                icon={iconFor(t)}
              >
                <div className="wx-card-inner">
                  {/* Our own, always-visible date chip inside the card */}
                  {item.dateRange && <span className="wx-date-inset">{item.dateRange}</span>}

                  <div className="wx-chip">{t.toUpperCase()}</div>

                  {(t === 'work' || t === 'project' || t === 'leadership' || t === 'research') ? (
                    <>
                      <h3 className="wx-role">{item.title}</h3>
                      <h4 className="wx-org">{item.name}</h4>
                      {item.techStack && String(item.techStack).trim() && (
                        <div className="wx-tech">
                          {String(item.techStack).split(',').map(s => s.trim()).filter(Boolean).map((tech, i) => (
                            <span className="wx-badge" key={`${tech}-${i}`}>{tech}</span>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <h3 className="wx-org">{item.name}</h3>
                      <h4 className="wx-role">{item.title}</h4>
                    </>
                  )}

                  {Array.isArray(item.summaryPoints) && item.summaryPoints.length > 0 && (
                    <ul className="wx-list">
                      {item.summaryPoints.map((pt, i) => <li className="wx-li" key={i}>{pt}</li>)}
                    </ul>
                  )}
                </div>
              </VerticalTimelineElement>
            );
          })}

          {/* End cap */}
          <VerticalTimelineElement
            iconStyle={{
              background: 'linear-gradient(135deg,#70e1f5,#ffd194)',
              color: '#2b2b2b',
              boxShadow: '0 0 0 6px rgba(255,255,255,0.06), 0 8px 20px rgba(0,0,0,0.35)',
              border: '2px solid rgba(255,255,255,0.25)',
            }}
            icon={<StarIcon />}
          />
        </VerticalTimeline>
      </div>
    </>
  );
};

export default WorkExperience;
