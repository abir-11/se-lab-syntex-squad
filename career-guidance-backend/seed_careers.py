from app.database.mongodb import db


UIU_CAREERS = [
    {
        "name": "Software Engineer",
        "description": "Designs, develops, tests, and maintains robust software systems and cloud applications.",
        "demand": "High",
        "required_skills": ["Python", "JavaScript", "Problem Solving", "Data Structures", "Algorithms"],
        "required_interests": ["Programming", "Technology"],
        "required_education": "B.Sc. in CSE",
        "required_department": "Computer Science and Engineering",
        "required_experience": "Beginner",
        "required_work_mode": "Remote",
        "required_career_goal": "Software Developer"
    },
    {
        "name": "AI / Machine Learning Engineer",
        "description": "Builds, trains, and deploys intelligent algorithms, computer vision, and NLP models.",
        "demand": "Very High",
        "required_skills": ["Python", "PyTorch", "Machine Learning", "Deep Learning", "Statistics"],
        "required_interests": ["Artificial Intelligence", "Data Science"],
        "required_education": "B.Sc. in Data Science",
        "required_department": "Data Science",
        "required_experience": "Beginner",
        "required_work_mode": "Remote",
        "required_career_goal": "AI Engineer"
    },
    {
        "name": "Data Scientist",
        "description": "Extracts insights from large datasets and creates predictive models for business intelligence.",
        "demand": "High",
        "required_skills": ["Python", "SQL", "Machine Learning", "Data Analysis", "Statistics"],
        "required_interests": ["Data Science", "Analytics"],
        "required_education": "B.Sc. in Data Science",
        "required_department": "Data Science",
        "required_experience": "Beginner",
        "required_work_mode": "Hybrid",
        "required_career_goal": "Data Scientist"
    },
    {
        "name": "Embedded Systems & IoT Engineer",
        "description": "Designs hardware controllers, microcontroller firmware, and connected IoT devices.",
        "demand": "High",
        "required_skills": ["C/C++", "Circuit Design", "Microcontrollers", "MATLAB", "IoT"],
        "required_interests": ["Electronics", "Hardware"],
        "required_education": "B.Sc. in EEE",
        "required_department": "Electrical and Electronic Engineering",
        "required_experience": "Beginner",
        "required_work_mode": "On-site",
        "required_career_goal": "Embedded Engineer"
    },
    {
        "name": "Power & Renewable Energy Systems Engineer",
        "description": "Focuses on electrical power grid management, renewable energy systems, and high-voltage design.",
        "demand": "High",
        "required_skills": ["Power Systems", "MATLAB", "Simulink", "Circuit Analysis", "Renewable Energy"],
        "required_interests": ["Energy", "Power Electronics"],
        "required_education": "B.Sc. in EEE",
        "required_department": "Electrical and Electronic Engineering",
        "required_experience": "Beginner",
        "required_work_mode": "On-site",
        "required_career_goal": "Power Engineer"
    },
    {
        "name": "Structural / Civil Engineer",
        "description": "Plans, designs, and supervises construction of infrastructure including buildings, bridges, and highways.",
        "demand": "High",
        "required_skills": ["AutoCAD", "ETABS", "Structural Analysis", "Project Management", "Site Surveying"],
        "required_interests": ["Infrastructure", "Construction"],
        "required_education": "B.Sc. in Civil Engineering",
        "required_department": "Civil Engineering",
        "required_experience": "Beginner",
        "required_work_mode": "On-site",
        "required_career_goal": "Civil Engineer"
    },
    {
        "name": "Financial Analyst / Corporate Planner",
        "description": "Evaluates financial data, prepares budget projections, and advises corporate investment strategies.",
        "demand": "High",
        "required_skills": ["Financial Modeling", "Excel", "Corporate Finance", "Accounting", "Valuation"],
        "required_interests": ["Finance", "Investments"],
        "required_education": "BBA",
        "required_department": "School of Business and Economics",
        "required_experience": "Beginner",
        "required_work_mode": "Hybrid",
        "required_career_goal": "Financial Analyst"
    },
    {
        "name": "Audit & Financial Accountant",
        "description": "Manages tax filings, ledger entries, compliance audits, and enterprise resource planning systems.",
        "demand": "High",
        "required_skills": ["Accounting", "Tally", "SAP", "Taxation", "Financial Auditing"],
        "required_interests": ["Accounting", "Compliance"],
        "required_education": "BBA in AIS",
        "required_department": "School of Business and Economics",
        "required_experience": "Beginner",
        "required_work_mode": "On-site",
        "required_career_goal": "Accountant"
    },
    {
        "name": "Digital Marketing & Brand Executive",
        "description": "Executes multi-channel marketing strategies, manages social brand presence, and runs ad campaigns.",
        "demand": "Very High",
        "required_skills": ["Digital Marketing", "SEO", "Content Marketing", "Social Media", "Analytics"],
        "required_interests": ["Marketing", "Branding"],
        "required_education": "BBA",
        "required_department": "School of Business and Economics",
        "required_experience": "Beginner",
        "required_work_mode": "Remote",
        "required_career_goal": "Marketing Manager"
    },
    {
        "name": "Economic Policy Researcher",
        "description": "Analyzes macroeconomic trends, trade data, econometrics, and policy impacts for development organizations.",
        "demand": "Moderate",
        "required_skills": ["Stata", "R", "Econometrics", "Data Analysis", "Research Writing"],
        "required_interests": ["Economics", "Public Policy"],
        "required_education": "B.Sc. in Economics",
        "required_department": "School of Business and Economics",
        "required_experience": "Beginner",
        "required_work_mode": "Hybrid",
        "required_career_goal": "Economist"
    },
    {
        "name": "Media Specialist & Public Relations Manager",
        "description": "Oversees corporate communications, press relations, digital media publishing, and journalism.",
        "demand": "High",
        "required_skills": ["Journalism", "Public Relations", "Media Production", "Content Writing", "Video Editing"],
        "required_interests": ["Media", "Journalism"],
        "required_education": "BSS in MSJ",
        "required_department": "Media Studies and Journalism",
        "required_experience": "Beginner",
        "required_work_mode": "Hybrid",
        "required_career_goal": "PR Specialist"
    },
    {
        "name": "Sustainability & Environmental Consultant",
        "description": "Assesses environmental impacts, climate change policy, ESG compliance, and sustainable development.",
        "demand": "High",
        "required_skills": ["GIS", "Environmental Impact Assessment", "Sustainability", "Research", "Climate Policy"],
        "required_interests": ["Environment", "Development Studies"],
        "required_education": "BSS in EDS",
        "required_department": "Environment and Development Studies",
        "required_experience": "Beginner",
        "required_work_mode": "Hybrid",
        "required_career_goal": "Environmental Officer"
    },
    {
        "name": "Technical Content Strategist & Writer",
        "description": "Produces clear product documentation, corporate copy, editing, and strategic communications.",
        "demand": "High",
        "required_skills": ["Copywriting", "Editing", "English Communication", "Content Strategy", "SEO Writing"],
        "required_interests": ["Writing", "Literature"],
        "required_education": "BA in English",
        "required_department": "English",
        "required_experience": "Beginner",
        "required_work_mode": "Remote",
        "required_career_goal": "Technical Writer"
    },
    {
        "name": "Pharmaceutical Quality Control / Regulatory Officer",
        "description": "Ensures drug formulation safety, quality assurance standard operating procedures, and clinical regulatory compliance.",
        "demand": "High",
        "required_skills": ["Pharmacology", "HPLC", "Quality Assurance", "Drug Formulations", "GMP Standards"],
        "required_interests": ["Pharmaceuticals", "Healthcare"],
        "required_education": "B. Pharm.",
        "required_department": "Pharmacy",
        "required_experience": "Beginner",
        "required_work_mode": "On-site",
        "required_career_goal": "Pharmacist"
    },
    {
        "name": "Bioinformatician & Research Associate",
        "description": "Applies computational algorithms to biological sequence data, genetic modeling, and molecular biology.",
        "demand": "High",
        "required_skills": ["Python", "Bioinformatics", "Genetics", "Molecular Biology", "R"],
        "required_interests": ["Biotechnology", "Genetics"],
        "required_education": "B.Sc. in BSBGE",
        "required_department": "Biotechnology and Genetic Engineering",
        "required_experience": "Beginner",
        "required_work_mode": "Hybrid",
        "required_career_goal": "Biotech Researcher"
    }
]


def seed_database():
    for career in UIU_CAREERS:
        document = {
            **career,
            "career_name": career["name"],
            "interests": career["required_interests"],
            "education": [career["required_education"]],
            "departments": [career["required_department"]],
            "experience": [career["required_experience"]],
            "work_preference": [career["required_work_mode"]],
            "career_goals": [career["required_career_goal"]]
        }

        db.careers.update_one(
            {"name": career["name"]},
            {"$set": document},
            upsert=True
        )

    print(
        "Successfully seeded/updated "
        f"{len(UIU_CAREERS)} UIU career paths across all 4 schools "
        "into MongoDB 'careers' collection!"
    )


if __name__ == "__main__":
    seed_database()
