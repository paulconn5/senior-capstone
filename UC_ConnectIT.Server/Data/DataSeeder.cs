using UC_ConnectIT.Server.Models;

namespace UC_ConnectIT.Server.Data
{
    public static class DataSeeder
    {
        public static void Seed(AppDbContext db)
        {
            // Prevent reseeding
            if (db.TagCategories.Any())
                return;

            // Categories
            var categories = new List<TagCategory>
            {
                new TagCategory { Id = 1, Name = "Software Development" },
                new TagCategory { Id = 2, Name = "Web Development" },
                new TagCategory { Id = 3, Name = "Mobile Development" },
                new TagCategory { Id = 4, Name = "Networking & Cloud Infrastructure" },
                new TagCategory { Id = 5, Name = "Systems Administration & IT Operations" },
                new TagCategory { Id = 6, Name = "Databases & Data Engineering" },
                new TagCategory { Id = 7, Name = "Cybersecurity" },
                new TagCategory { Id = 8, Name = "Artificial Intelligence & Emerging Tech" }
            };

            db.TagCategories.AddRange(categories);

            // Subcategories
            var subcategories = new List<TagSubcategory>
            {
                // Software Dev
                new TagSubcategory { Id = 1, Name = "Programming Languages", TagCategoryId = 1 },
                new TagSubcategory { Id = 2, Name = "Frameworks & Platforms", TagCategoryId = 1 },
                new TagSubcategory { Id = 3, Name = "Core CS & Architecture", TagCategoryId = 1 },
                new TagSubcategory { Id = 4, Name = "DevOps & Engineering", TagCategoryId = 1 },

                // Web Dev
                new TagSubcategory { Id = 5, Name = "Frontend", TagCategoryId = 2 },
                new TagSubcategory { Id = 6, Name = "Backend & APIs", TagCategoryId = 2 },
                new TagSubcategory { Id = 7, Name = "Security & Performance", TagCategoryId = 2 },

                // Mobile
                new TagSubcategory { Id = 8, Name = "Mobile Platforms", TagCategoryId = 3 },

                // Networking
                new TagSubcategory { Id = 9, Name = "Networking Fundamentals", TagCategoryId = 4 },
                new TagSubcategory { Id = 10, Name = "Network Engineering", TagCategoryId = 4 },
                new TagSubcategory { Id = 11, Name = "Cloud & Virtualization", TagCategoryId = 4 },

                // IT Ops
                new TagSubcategory { Id = 12, Name = "Core Administration", TagCategoryId = 5 },
                new TagSubcategory { Id = 13, Name = "Enterprise IT", TagCategoryId = 5 },

                // Data
                new TagSubcategory { Id = 14, Name = "Database Fundamentals", TagCategoryId = 6 },
                new TagSubcategory { Id = 15, Name = "Advanced Data Systems", TagCategoryId = 6 },

                // Cybersecurity
                new TagSubcategory { Id = 16, Name = "Foundations", TagCategoryId = 7 },
                new TagSubcategory { Id = 17, Name = "Defensive Security", TagCategoryId = 7 },
                new TagSubcategory { Id = 18, Name = "Offensive Security", TagCategoryId = 7 },
                new TagSubcategory { Id = 19, Name = "Governance & Compliance", TagCategoryId = 7 },

                // AI
                new TagSubcategory { Id = 20, Name = "Machine Learning", TagCategoryId = 8 },
                new TagSubcategory { Id = 21, Name = "AI Applications", TagCategoryId = 8 }
            };

            db.TagSubcategories.AddRange(subcategories);

            // Degrees
            var degrees = new List<Degree>
            {
                new Degree { Id = 1, Name = "Software Application Development", TagSubcategoryId = 3 },
                new Degree { Id = 2, Name = "Game Development & Simulation", TagSubcategoryId = 3 },
                new Degree { Id = 3, Name = "Web Development", TagSubcategoryId = 5 },
                new Degree { Id = 4, Name = "Software Engineering", TagSubcategoryId = 3 },
                new Degree { Id = 5, Name = "Cybersecurity", TagSubcategoryId = 16 },
                new Degree { Id = 6, Name = "Foundations of Cybersecurity", TagSubcategoryId = 16 },
                new Degree { Id = 7, Name = "Data-Driven Cybersecurity", TagSubcategoryId = 17 },
                new Degree { Id = 8, Name = "Networking & Systems", TagSubcategoryId = 9 },
                new Degree { Id = 9, Name = "Network Engineering", TagSubcategoryId = 10 },
                new Degree { Id = 10, Name = "Data Technologies", TagSubcategoryId = 14 },
                new Degree { Id = 11, Name = "Database Management", TagSubcategoryId = 14 },
                new Degree { Id = 12, Name = "Data Science", TagSubcategoryId = 20 },
                new Degree { Id = 13, Name = "Information Technology", TagSubcategoryId = 13 }
            };

            db.Degrees.AddRange(degrees);

            // Tags
            var tags = new List<Tag>
            {
                // Programming Languages
                new Tag { Id = 1, Name = "Python", TagSubcategoryId = 1 },
                new Tag { Id = 2, Name = "Java", TagSubcategoryId = 1 },
                new Tag { Id = 3, Name = "C", TagSubcategoryId = 1 },
                new Tag { Id = 4, Name = "C++", TagSubcategoryId = 1 },
                new Tag { Id = 5, Name = "C#", TagSubcategoryId = 1 },
                new Tag { Id = 6, Name = "JavaScript", TagSubcategoryId = 1 },
                new Tag { Id = 7, Name = "TypeScript", TagSubcategoryId = 1 },
                new Tag { Id = 8, Name = "Go", TagSubcategoryId = 1 },
                new Tag { Id = 9, Name = "Rust", TagSubcategoryId = 1 },
                new Tag { Id = 10, Name = "Bash", TagSubcategoryId = 1 },
                new Tag { Id = 11, Name = "PowerShell", TagSubcategoryId = 1 },

                // Frameworks
                new Tag { Id = 12, Name = ".NET", TagSubcategoryId = 2 },
                new Tag { Id = 13, Name = "ASP.NET Core", TagSubcategoryId = 2 },
                new Tag { Id = 14, Name = "Spring Boot", TagSubcategoryId = 2 },
                new Tag { Id = 15, Name = "Django", TagSubcategoryId = 2 },
                new Tag { Id = 16, Name = "Flask", TagSubcategoryId = 2 },

                // Core CS
                new Tag { Id = 17, Name = "Object-Oriented Programming", TagSubcategoryId = 3 },
                new Tag { Id = 18, Name = "Data Structures", TagSubcategoryId = 3 },
                new Tag { Id = 19, Name = "Algorithms", TagSubcategoryId = 3 },
                new Tag { Id = 20, Name = "Systems Design", TagSubcategoryId = 3 },
                new Tag { Id = 21, Name = "Design Patterns", TagSubcategoryId = 3 },

                // DevOps
                new Tag { Id = 22, Name = "Git", TagSubcategoryId = 4 },
                new Tag { Id = 23, Name = "GitHub", TagSubcategoryId = 4 },
                new Tag { Id = 24, Name = "CI/CD", TagSubcategoryId = 4 },
                new Tag { Id = 25, Name = "Docker", TagSubcategoryId = 4 },
                new Tag { Id = 26, Name = "Kubernetes", TagSubcategoryId = 4 },

                // Web Frontend
                new Tag { Id = 27, Name = "HTML5", TagSubcategoryId = 5 },
                new Tag { Id = 28, Name = "CSS3", TagSubcategoryId = 5 },
                new Tag { Id = 29, Name = "React", TagSubcategoryId = 5 },
                new Tag { Id = 30, Name = "Angular", TagSubcategoryId = 5 },
                new Tag { Id = 31, Name = "Vue.js", TagSubcategoryId = 5 },

                // Backend
                new Tag { Id = 32, Name = "Node.js", TagSubcategoryId = 6 },
                new Tag { Id = 33, Name = "Express.js", TagSubcategoryId = 6 },
                new Tag { Id = 34, Name = "REST APIs", TagSubcategoryId = 6 },
                new Tag { Id = 35, Name = "GraphQL", TagSubcategoryId = 6 },

                // Networking
                new Tag { Id = 36, Name = "TCP/IP", TagSubcategoryId = 9 },
                new Tag { Id = 37, Name = "OSI Model", TagSubcategoryId = 9 },
                new Tag { Id = 38, Name = "Subnetting", TagSubcategoryId = 9 },
                new Tag { Id = 39, Name = "DNS", TagSubcategoryId = 9 },
                new Tag { Id = 40, Name = "DHCP", TagSubcategoryId = 9 },

                // Cloud
                new Tag { Id = 41, Name = "AWS", TagSubcategoryId = 11 },
                new Tag { Id = 42, Name = "Azure", TagSubcategoryId = 11 },
                new Tag { Id = 43, Name = "GCP", TagSubcategoryId = 11 },

                // Databases
                new Tag { Id = 44, Name = "SQL", TagSubcategoryId = 14 },
                new Tag { Id = 45, Name = "PostgreSQL", TagSubcategoryId = 14 },
                new Tag { Id = 46, Name = "MongoDB", TagSubcategoryId = 14 },

                // Cybersecurity
                new Tag { Id = 47, Name = "IAM", TagSubcategoryId = 16 },
                new Tag { Id = 48, Name = "Encryption", TagSubcategoryId = 16 },
                new Tag { Id = 49, Name = "MFA", TagSubcategoryId = 16 },
                new Tag { Id = 50, Name = "SIEM", TagSubcategoryId = 17 },
                new Tag { Id = 51, Name = "Incident Response", TagSubcategoryId = 17 },
                new Tag { Id = 52, Name = "Penetration Testing", TagSubcategoryId = 18 },

                // AI
                new Tag { Id = 53, Name = "Machine Learning", TagSubcategoryId = 20 },
                new Tag { Id = 54, Name = "Deep Learning", TagSubcategoryId = 20 },
                new Tag { Id = 55, Name = "NLP", TagSubcategoryId = 20 }
            };

            db.Tags.AddRange(tags);

            db.SaveChanges();
        }
    }
}