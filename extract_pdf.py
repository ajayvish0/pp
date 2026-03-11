import PyPDF2
with open('Jake_s_Resume__Anonymous_.pdf', 'rb') as file:
    reader = PyPDF2.PdfReader(file)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
with open('resume_text.txt', 'w', encoding='utf-8') as out_file:
    out_file.write(text)
