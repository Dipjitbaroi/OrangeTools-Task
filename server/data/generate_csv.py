import csv
import random
import string

tags_pool = ["lead", "prospect", "client"]
company_suffixes = ["Inc", "Ltd", "Group", "Corp", "LLC", "Bros", "& Co", "& Sons"]

def random_word(min_len, max_len):
    length = random.randint(min_len, max_len)
    return ''.join(random.choices(string.ascii_lowercase, k=length)).capitalize()

def generate_name():
    first = random_word(3, 8)
    last = random_word(4, 10)
    return f"{first} {last}"

def generate_email(name):
    name_part = name.lower().replace(' ', '.')
    return f"{name_part}{random.randint(1, 9999)}@example.com"

def generate_phone():
    return ''.join(random.choices("0123456789", k=10))

def generate_company():
    return f"{random_word(4, 8)} {random.choice(company_suffixes)}"

def generate_location():
    return random_word(4, 10)

def generate_tags():
    return ",".join(random.sample(tags_pool, random.randint(1, 2)))

def create_csv(filename, total_rows):
    with open(filename, 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(["name", "email", "phone", "company", "location", "tags"])
        for i in range(total_rows):
            name = generate_name()
            email = generate_email(name)
            phone = generate_phone()
            company = generate_company()
            location = generate_location()
            tags = generate_tags()
            writer.writerow([name, email, phone, company, location, tags])
            if (i + 1) % 100000 == 0:
                print(f"{i + 1} rows written...")

if __name__ == "__main__":
    create_csv("million_records.csv", 1_000_000)
    print("✅ Done generating 1 million fully random records!")
