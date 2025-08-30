import { Mail, Github, Linkedin, Briefcase, MapPin, GraduationCap, Download } from 'lucide-react';
import { Document, Page, Text, View, StyleSheet, Link, PDFDownloadLink } from '@react-pdf/renderer';
import React, { useState, useEffect } from 'react';


// Reusable component for each experience entry
const ExperienceItem = ({ role, company, duration, description }) => (
  <div className="mb-8 last:mb-0">
    <div className="flex flex-col sm:flex-row justify-between sm:items-baseline mb-1">
      <h3 className="text-xl font-bold text-gray-800">{role}</h3>
      <p className="text-sm text-gray-500 font-medium">{duration}</p>
    </div>
    <p className="text-md font-semibold text-indigo-700 mb-2">{company}</p>
    <ul className="list-disc list-inside text-gray-600 space-y-1">
      {description.map((point, index) => (
        <li key={index}>{point}</li>
      ))}
    </ul>
  </div>
);

// Reusable component for education
const EducationItem = ({ degree, institution, duration, details }) => (
    <div className="mb-6 last:mb-0">
        <div className="flex justify-between items-baseline">
            <h3 className="text-xl font-bold text-gray-800">{degree}</h3>
            <p className="text-sm text-gray-500 font-medium">{duration}</p>
        </div>
        <p className="text-md font-semibold text-indigo-700 mb-1">{institution}</p>
        {details && <p className="text-gray-600">{details}</p>}
    </div>
);

// --- PDF DOCUMENT COMPONENT ---
// This component defines the structure of the PDF using @react-pdf/renderer components
const styles = StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 10, paddingTop: 30, paddingLeft: 40, paddingRight: 40, paddingBottom: 30, color: '#1a202c' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 15 },
    name: { fontSize: 16, fontWeight: 'bold' }, // Smaller font size for name
    contactInfo: { fontSize: 9 }, // Smaller font size for contact info
    section: { marginBottom: 12 }, // Reduced margin
    sectionTitle: { fontSize: 14, fontWeight: 'bold', borderBottom: '1px solid #1a202c', paddingBottom: 3, marginBottom: 6 }, // Reduced margin
    storyText: { fontSize: 9, lineHeight: 1.3, marginBottom: 6, textAlign: 'justify' }, // Smaller font size and line height
    skillLine: { flexDirection: 'row', marginBottom: 2 }, // Further reduced margin
    skillCategory: { fontSize: 9, fontWeight: 'bold', width: '35%' },
    skillList: { fontSize: 9, width: '65%', lineHeight: 1.3 }, // Adjusted line height
    item: { marginBottom: 8 }, // Reduced margin
    itemHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    itemTitle: { fontSize: 11, fontWeight: 'bold' },
    itemSubTitle: { fontSize: 10, fontStyle: 'italic', marginBottom: 1 }, // Reduced margin
    itemDuration: { fontSize: 9, color: '#4a5568' }, // Smaller font size
    itemList: { marginLeft: 10, marginTop: 1 }, // Reduced margin
    listItem: { flexDirection: 'row' },
    bullet: { width: 10, fontSize: 9 }, // Smaller font size
    listItemText: { flex: 1, fontSize: 9, lineHeight: 1.2 }, // Smaller font size and line height
});

const ResumePDF = ({ user }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.contactInfo}>
                    {user.contact.location} | {user.contact.email} | {user.contact.github.replace('https://', '')}
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>About Me</Text>
                {user.storyAndObjective.map((paragraph, i) => (
                    <Text key={i} style={styles.storyText}>{paragraph}</Text>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Technical Skills</Text>
                {Object.entries(user.technicalSkills).map(([category, skills]) => (
                    <View key={category} style={styles.skillLine}>
                        <Text style={styles.skillCategory}>{category}:</Text>
                        <Text style={styles.skillList}>{skills.join(', ')}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Soft Skills and Other Qualities</Text>
                <View style={styles.itemList}>
                    {user.softSkills.map((skill, j) => (
                        <View key={j} style={styles.listItem}>
                            <Text style={styles.bullet}>• </Text>
                            <Text style={styles.listItemText}>{skill}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Professional Experience</Text>
                {user.experience.map((job, i) => (
                    <View key={i} style={styles.item}>
                        <View style={styles.itemHeader}>
                            <Text style={styles.itemTitle}>{job.role}</Text>
                            <Text style={styles.itemDuration}>{job.duration}</Text>
                        </View>
                        <Text style={styles.itemSubTitle}>{job.company}</Text>
                        <View style={styles.itemList}>
                            {job.description.map((point, j) => (
                                <View key={j} style={styles.listItem}>
                                    <Text style={styles.bullet}>• </Text>
                                    <Text style={styles.listItemText}>{point}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </View>
            
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education & Certifications</Text>
                {user.education.map((edu, i) => (
                    <View key={i} style={styles.item}>
                        <View style={styles.itemHeader}>
                            <Text style={styles.itemTitle}>{edu.degree}</Text>
                            <Text style={styles.itemDuration}>{edu.duration}</Text>
                        </View>
                        <Text style={styles.itemSubTitle}>{edu.institution}</Text>
                         {edu.details && <Text style={{ fontSize: 9, marginTop: 1 }}>{edu.details}</Text>}
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);


export default function ResumePage() {
  // --- USER DATA ---
  const user = {
    name: "Christopher Olsen",
    contact: {
      location: "New York, NY",
      email: "chrisolsenweb@gmail.com",
      github: "https://github.com/ChrisEOlsen",
    },
    storyAndObjective: [
        "I moved to NY from a small city in southern Norway at 17. As I was eager to jump into the workforce, I found personal training to be an exciting venture where I could assist in making a noticeable impact on people’s health and well-being. Over time I was able to build a successful career and nearly a decade later, I've had the privilege of fostering relationships with fascinating individuals, including a CEO of Coursera, the president of ISACA NY, an AI researcher at a quantitative trading firm, and a tech lead at Meta. My job has afforded me the chance to pick the brains of people who are at the highest levels of their respective fields over the course of many years, all while teaching them how to squat and deadlift safely in return.",
        "My true dedication to learning about computers came about during the pandemic when personal training came to a temporary, yet sudden halt. I had returned to Norway for a year, where I spent my time exercising, winter camping, and learning about the world of networks and software as I tinkered with my Linux home server. The past 8 years of working within the fitness industry have been deeply rewarding. However, my life has recently changed, as I have now started my own family. I now find myself in a place in life where I am highly motivated and ready to broaden my horizons. I aim to put myself in an environment where I can learn, and embark on a new journey of building a long lasting, scalable career, where I can apply the invaluable life lessons I have learned from my current profession, and to start leveraging my developed work ethic elsewhere."
    ],
    technicalSkills: {
      "Languages": ["Python", "C++", "JavaScript", "SQL"],
      "Frameworks & Databases": ["FastAPI", "Next.js", "React", "PostgreSQL"],
      "Cloud & DevOps": ["Docker", "Linux", "Google Cloud Platform (GCP)", "Cloudflare"],
      "Cybersecurity": ["Penetration Testing Methodologies", "Network Security", "Vulnerability Assessment"],
    },
    softSkills: [
        "Excellent communication and management of interpersonal relationships",
        "Time management",
        "Patient and calm in fast-paced environments",
        "Diligent and determined when faced with a challenge",
        "Fluent in English and Norwegian",
        "Handyman"
    ],
    experience: [
      {
        role: "Personal Trainer",
        company: "New York, NY",
        duration: "2019 – Present",
        description: [
          "Managed a diverse portfolio of 20+ clients, developing customized, long-term fitness plans.",
          "Cultivated strong, trust-based relationships, leading to exceptional client retention and a referral-based business.",
          "Fostered a unique network of mentors and advisors from the tech and finance industries through my client work, gaining invaluable insight into real-world challenges.",
        ],
      },
      {
        role: "Lead Parkour Instructor",
        company: "New York, NY",
        duration: "2017 – 2019",
        description: [
          "Led and mentored groups of up to 15 children, developing a curriculum focused on safety, skill progression, and building confidence through disciplined practice.",
        ],
      },
    ],
    education: [
        {
            degree: "ACE Certified Personal Trainer",
            institution: "American Council on Exercise",
            duration: "",
            details: ""
        },
        {
            degree: "Bachelor of Science in Software Engineering (In Progress)",
            institution: "Western Governors University",
            duration: "Expected Completion: Summer 2026",
            details: ""
        },
        {
            degree: "Google Cybersecurity Professional Certificate",
            institution: "Coursera",
            duration: "Completed 2024",
            details: ""
        },
        {
            degree: "Pentesting Career Path",
            institution: "Hack The Box",
            duration: "In Progress",
            details: ""
        }
    ]
  };

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);


  // --- MAIN COMPONENT ---
  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <main className="container mx-auto max-w-5xl p-4 sm:p-8">
        
        <div className="flex justify-center mb-4">
            {isClient && (
                <PDFDownloadLink
                    document={<ResumePDF user={user} />}
                    fileName={`${user.name.replace(' ', '_')}_Resume.pdf`}
                    className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                >
                    {({ blob, url, loading, error }) =>
                        loading ? 'Loading document...' : (
                            <>
                                <Download size={18} />
                                Download as PDF
                            </>
                        )
                    }
                </PDFDownloadLink>
            )}
        </div>

        <div id="resume-content" className="bg-white rounded-2xl shadow-xl p-8 md:p-12">

          {/* Header Section */}
          <header className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-gray-800 mb-2">{user.name}</h1>
            <div className="flex justify-center items-center flex-wrap gap-x-6 gap-y-2 text-gray-600 mt-4">
                <span className="flex items-center gap-2"><MapPin size={16}/> {user.contact.location}</span>
                <a href={`mailto:${user.contact.email}`} className="flex items-center gap-2 hover:text-indigo-600"><Mail size={16}/> {user.contact.email}</a>
                <a href={user.contact.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-indigo-600"><Github size={16}/> {user.contact.github.replace('https://', '')}</a>
            </div>
          </header>

          {/* My Story & Objective Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-indigo-300 pb-2 mb-6">About Me</h2>
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                {user.storyAndObjective.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
          </section>

          {/* Technical Skills Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-indigo-300 pb-2 mb-6">Technical Skills</h2>
            <div className="space-y-4">
              {Object.entries(user.technicalSkills).map(([category, skills]) => (
                <div key={category} className="flex flex-col sm:flex-row">
                  <h3 className="w-full sm:w-1/3 font-bold text-gray-700 text-lg mb-2 sm:mb-0">{category}</h3>
                  <div className="w-full sm:w-2/3 flex flex-wrap gap-2">
                    {skills.map(skill => (
                      <span key={skill} className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Soft Skills Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-indigo-300 pb-2 mb-6">Soft Skills and Other Qualities</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 text-lg">
                {user.softSkills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
            </ul>
          </section>

          {/* Experience Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-indigo-300 pb-2 mb-6 flex items-center gap-3">
              <Briefcase size={28}/> Professional Experience
            </h2>
            {user.experience.map((job, index) => (
              <ExperienceItem key={index} {...job} />
            ))}
          </section>

          {/* Education & Certifications Section */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-indigo-300 pb-2 mb-6 flex items-center gap-3">
              <GraduationCap size={28}/> Education & Certifications
            </h2>
            {user.education.map((edu, index) => (
                <EducationItem key={index} {...edu} />
            ))}
          </section>

        </div>
      </main>
    </div>
  );
}