import nltk
import csv

# Download NLTK data for part-of-speech tagging
nltk.download("averaged_perceptron_tagger")


def categorize_words(words):
    tagged_words = nltk.pos_tag(words)
    categorized_words = []

    for word, pos in tagged_words:
        if pos.startswith("N"):
            category = "Noun"
            categorized_words.append((word, category))
        elif pos.startswith("V"):
            category = "Verb"
            categorized_words.append((word, category))

    return categorized_words


def write_to_csv(data, csv_filename):
    with open(csv_filename, "w", newline="") as csvfile:
        fieldnames = ["ID", "Word", "Category"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        for row in data:
            writer.writerow({"ID": row[0], "Word": row[1], "Category": row[2]})


# Read words and IDs from CSV file
def read_csv(file_path):
    with open(file_path, "r") as csvfile:
        reader = csv.reader(csvfile)
        next(reader)  # Skip header row
        return [(int(row[0]), row[1]) for row in reader]


# Example usage
word_list_with_ids = read_csv("ent.csv")
words_only = [word for _, word in word_list_with_ids]

categorized_words = categorize_words(words_only)

# Combine the IDs with the categorized words
result_data = [
    (word_id, word, category)
    for (word_id, word), (_, category) in zip(word_list_with_ids, categorized_words)
]

# Write to CSV file
write_to_csv(result_data, "word_categories.csv")
