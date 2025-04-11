import streamlit as st # type: ignore
import pandas as pd
from datetime import datetime, timedelta
import time
import webbrowser

# Page Configuration
st.set_page_config(page_title="MediBuddy Reminder", layout="centered", page_icon="💊")

# Title and description
st.title("💊 MediBuddy Reminder")
st.subheader("Your personalized medication reminder and pharmacy guide")

# Sidebar for navigation
with st.sidebar:
    st.header("Navigation")
    option = st.radio("Choose an option:", ["Set Medication Reminder", "View Reminders", "Find Nearby Pharmacies"])

# Data storage
if "medications" not in st.session_state:
    st.session_state["medications"] = []

# Functions
def add_reminder(medication_name, dosage, time_of_day, start_date):
    reminder = {
        "Medication Name": medication_name,
        "Dosage": dosage,
        "Time": time_of_day.strftime("%H:%M"),
        "Start Date": start_date.strftime("%Y-%m-%d"),
    }
    st.session_state["medications"].append(reminder)
    st.success(f"Reminder for {medication_name} added!")

# Set Medication Reminder
if option == "Set Medication Reminder":
    st.header("Set a New Medication Reminder")
    medication_name = st.text_input("Medication Name:", placeholder="E.g., Paracetamol")
    dosage = st.text_input("Dosage (e.g., 1 tablet, 5ml):", placeholder="E.g., 1 tablet")
    time_of_day = st.time_input("Time for reminder:")
    start_date = st.date_input("Start Date:")
    
    if st.button("Add Reminder"):
        if medication_name and dosage:
            add_reminder(medication_name, dosage, time_of_day, start_date)
        else:
            st.error("Please fill all the fields.")

# View Reminders
elif option == "View Reminders":
    st.header("Your Medication Reminders")
    if st.session_state["medications"]:
        df = pd.DataFrame(st.session_state["medications"])
        st.table(df)
    else:
        st.info("No reminders set yet. Add a new one to get started!")

# Find Nearby Pharmacies
elif option == "Find Nearby Pharmacies":
    st.header("Find Nearby Pharmacies")
    st.write("In case of urgency, you can find pharmacies near you.")

    # Example buttons for redirecting to online stores
    if st.button("Search on Google Maps"):
        webbrowser.open("https://www.google.com/maps/search/pharmacy/")

    if st.button("Order from 1mg"):
        webbrowser.open("https://www.1mg.com/")

    if st.button("Order from Apollo Pharmacy"):
        webbrowser.open("https://www.apollopharmacy.in/")

# Footer
st.markdown("---")
st.markdown("© 2025 MediBuddy Reminder. All rights reserved.")