import csv
import random
import string

def generate_random_string(length):
    """Generates a random string of given length."""
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))

def generate_phone_number():
    """Generates a random 10-digit phone number."""
    return ''.join(random.choice(string.digits) for _ in range(10))

def generate_email(name):
    """Generates a random email address based on the name."""
    domains = ['example.com', 'test.com', 'domain.net', 'sample.org', 'email.co']
    return f"{name.lower().replace(' ', '.')}@{random.choice(domains)}"

def generate_csv_data(filename, num_rows):
    """
    Generates a CSV file with dummy data.

    Args:
        filename (str): The name of the CSV file to create.
        num_rows (int): The number of data rows to generate.
    """
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['name', 'email', 'phone', 'company', 'tags'])  # Write header row

        for i in range(num_rows):
            name = f"Person {i+1}"
            email = generate_email(name)
            phone = generate_phone_number()
            company = f"Company {random.randint(1, 100)}"
            tags = ','.join([f"tag{random.randint(1, 5)}" for _ in range(random.randint(1, 3))])  # 1-3 tags
            writer.writerow([name, email, phone, company, tags])
    print(f"CSV file '{filename}' with {num_rows} rows generated successfully.")

if __name__ == "__main__":
    num_rows = 1000000
    filename = "1m_data.csv"
    generate_csv_data(filename, num_rows)
