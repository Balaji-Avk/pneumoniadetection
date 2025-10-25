FROM python:3.13-slim
COPY . .
RUN pip3 install --upgrade pip 
RUN python3 -m venv venv && . venv/bin/activate
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 5000
ENV GEMINI_API_KEY=$GEMINI_API_KEY
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "server:app"]