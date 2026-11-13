export interface CuratedCity {
  name: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
}

export const CURATED_CITIES: CuratedCity[] = [
  // Uttar Pradesh
  { name: "Varanasi", state: "Uttar Pradesh", country: "India", lat: 25.3176, lon: 82.9739 },
  { name: "Agra", state: "Uttar Pradesh", country: "India", lat: 27.1767, lon: 78.0081 },
  { name: "Lucknow", state: "Uttar Pradesh", country: "India", lat: 26.8467, lon: 80.9462 },
  { name: "Prayagraj", state: "Uttar Pradesh", country: "India", lat: 25.4358, lon: 81.8463 },
  { name: "Ayodhya", state: "Uttar Pradesh", country: "India", lat: 26.7922, lon: 82.1998 },
  { name: "Mathura", state: "Uttar Pradesh", country: "India", lat: 27.4924, lon: 77.6737 },
  { name: "Vrindavan", state: "Uttar Pradesh", country: "India", lat: 27.5806, lon: 77.7006 },
  { name: "Bareilly", state: "Uttar Pradesh", country: "India", lat: 28.3670, lon: 79.4304 },
  { name: "Kanpur", state: "Uttar Pradesh", country: "India", lat: 26.4499, lon: 80.3319 },
  { name: "Noida", state: "Uttar Pradesh", country: "India", lat: 28.5355, lon: 77.3910 },
  { name: "Greater Noida", state: "Uttar Pradesh", country: "India", lat: 28.4744, lon: 77.5040 },
  { name: "Ghaziabad", state: "Uttar Pradesh", country: "India", lat: 28.6692, lon: 77.4538 },
  { name: "Jhansi", state: "Uttar Pradesh", country: "India", lat: 25.4484, lon: 78.5685 },
  { name: "Aligarh", state: "Uttar Pradesh", country: "India", lat: 27.8974, lon: 78.0880 },
  { name: "Gorakhpur", state: "Uttar Pradesh", country: "India", lat: 26.7606, lon: 83.3732 },
  { name: "Meerut", state: "Uttar Pradesh", country: "India", lat: 28.9845, lon: 77.7064 },
  { name: "Moradabad", state: "Uttar Pradesh", country: "India", lat: 28.8386, lon: 78.7733 },
  { name: "Saharanpur", state: "Uttar Pradesh", country: "India", lat: 29.9679, lon: 77.5510 },

  // Delhi NCR
  { name: "New Delhi", state: "Delhi", country: "India", lat: 28.6139, lon: 77.2090 },
  { name: "Delhi", state: "Delhi", country: "India", lat: 28.7041, lon: 77.1025 },
  { name: "Gurugram", state: "Haryana", country: "India", lat: 28.4595, lon: 77.0266 },
  { name: "Faridabad", state: "Haryana", country: "India", lat: 28.4089, lon: 77.3178 },

  // Rajasthan
  { name: "Jaipur", state: "Rajasthan", country: "India", lat: 26.9124, lon: 75.7873 },
  { name: "Udaipur", state: "Rajasthan", country: "India", lat: 24.5854, lon: 73.7125 },
  { name: "Jodhpur", state: "Rajasthan", country: "India", lat: 26.2389, lon: 73.0243 },
  { name: "Jaisalmer", state: "Rajasthan", country: "India", lat: 26.9157, lon: 70.9083 },
  { name: "Pushkar", state: "Rajasthan", country: "India", lat: 26.4897, lon: 74.5511 },
  { name: "Bikaner", state: "Rajasthan", country: "India", lat: 28.0229, lon: 73.3119 },
  { name: "Ajmer", state: "Rajasthan", country: "India", lat: 26.4499, lon: 74.6399 },
  { name: "Mount Abu", state: "Rajasthan", country: "India", lat: 24.5926, lon: 72.7156 },
  { name: "Sawai Madhopur", state: "Rajasthan", country: "India", lat: 25.9928, lon: 76.3688 },
  { name: "Kota", state: "Rajasthan", country: "India", lat: 25.2138, lon: 75.8648 },
  { name: "Alwar", state: "Rajasthan", country: "India", lat: 27.5530, lon: 76.6346 },
  { name: "Chittorgarh", state: "Rajasthan", country: "India", lat: 24.8887, lon: 74.6269 },

  // Maharashtra
  { name: "Mumbai", state: "Maharashtra", country: "India", lat: 19.0760, lon: 72.8777 },
  { name: "Pune", state: "Maharashtra", country: "India", lat: 18.5204, lon: 73.8567 },
  { name: "Nagpur", state: "Maharashtra", country: "India", lat: 21.1458, lon: 79.0882 },
  { name: "Nashik", state: "Maharashtra", country: "India", lat: 19.9975, lon: 73.7898 },
  { name: "Chhatrapati Sambhaji Nagar", state: "Maharashtra", country: "India", lat: 19.8762, lon: 75.3433 },
  { name: "Shirdi", state: "Maharashtra", country: "India", lat: 19.7645, lon: 74.4762 },
  { name: "Mahabaleshwar", state: "Maharashtra", country: "India", lat: 17.9237, lon: 73.6586 },
  { name: "Lonavala", state: "Maharashtra", country: "India", lat: 18.7557, lon: 73.4091 },
  { name: "Kolhapur", state: "Maharashtra", country: "India", lat: 16.7050, lon: 74.2433 },
  { name: "Thane", state: "Maharashtra", country: "India", lat: 19.2183, lon: 72.9781 },
  { name: "Navi Mumbai", state: "Maharashtra", country: "India", lat: 19.0330, lon: 73.0297 },
  { name: "Alibaug", state: "Maharashtra", country: "India", lat: 18.6414, lon: 72.8722 },

  // Goa
  { name: "Panaji", state: "Goa", country: "India", lat: 15.4909, lon: 73.8278 },
  { name: "North Goa", state: "Goa", country: "India", lat: 15.5494, lon: 73.7535 },
  { name: "South Goa", state: "Goa", country: "India", lat: 15.2832, lon: 74.0041 },
  { name: "Margao", state: "Goa", country: "India", lat: 15.2832, lon: 73.9862 },
  { name: "Calangute", state: "Goa", country: "India", lat: 15.5439, lon: 73.7553 },
  { name: "Vasco da Gama", state: "Goa", country: "India", lat: 15.3995, lon: 73.8124 },

  // Himachal Pradesh
  { name: "Manali", state: "Himachal Pradesh", country: "India", lat: 32.2396, lon: 77.1887 },
  { name: "Shimla", state: "Himachal Pradesh", country: "India", lat: 31.1048, lon: 77.1734 },
  { name: "Dharamshala", state: "Himachal Pradesh", country: "India", lat: 32.2190, lon: 76.3234 },
  { name: "McLeod Ganj", state: "Himachal Pradesh", country: "India", lat: 32.2426, lon: 76.3213 },
  { name: "Kullu", state: "Himachal Pradesh", country: "India", lat: 31.9579, lon: 77.1095 },
  { name: "Kasol", state: "Himachal Pradesh", country: "India", lat: 32.0100, lon: 77.3150 },
  { name: "Spiti Valley", state: "Himachal Pradesh", country: "India", lat: 32.2461, lon: 78.0349 },
  { name: "Dalhousie", state: "Himachal Pradesh", country: "India", lat: 32.5387, lon: 75.9710 },
  { name: "Kasauli", state: "Himachal Pradesh", country: "India", lat: 30.9013, lon: 76.9649 },
  { name: "Bir Billing", state: "Himachal Pradesh", country: "India", lat: 32.0526, lon: 76.7170 },

  // Uttarakhand
  { name: "Rishikesh", state: "Uttarakhand", country: "India", lat: 30.0869, lon: 78.2676 },
  { name: "Haridwar", state: "Uttarakhand", country: "India", lat: 29.9457, lon: 78.1642 },
  { name: "Dehradun", state: "Uttarakhand", country: "India", lat: 30.3165, lon: 78.0322 },
  { name: "Mussoorie", state: "Uttarakhand", country: "India", lat: 30.4598, lon: 78.0644 },
  { name: "Nainital", state: "Uttarakhand", country: "India", lat: 29.3919, lon: 79.4542 },
  { name: "Kedarnath", state: "Uttarakhand", country: "India", lat: 30.7346, lon: 79.0669 },
  { name: "Badrinath", state: "Uttarakhand", country: "India", lat: 30.7433, lon: 79.4938 },
  { name: "Auli", state: "Uttarakhand", country: "India", lat: 30.5292, lon: 79.5694 },
  { name: "Almora", state: "Uttarakhand", country: "India", lat: 29.5971, lon: 79.6591 },
  { name: "Jim Corbett", state: "Uttarakhand", country: "India", lat: 29.5300, lon: 78.7747 },

  // Karnataka
  { name: "Bengaluru", state: "Karnataka", country: "India", lat: 12.9716, lon: 77.5946 },
  { name: "Mysuru", state: "Karnataka", country: "India", lat: 12.2958, lon: 76.6394 },
  { name: "Hampi", state: "Karnataka", country: "India", lat: 15.3350, lon: 76.4600 },
  { name: "Coorg", state: "Karnataka", country: "India", lat: 12.3375, lon: 75.8069 },
  { name: "Gokarna", state: "Karnataka", country: "India", lat: 14.5479, lon: 74.3188 },
  { name: "Mangaluru", state: "Karnataka", country: "India", lat: 12.9141, lon: 74.8560 },
  { name: "Udupi", state: "Karnataka", country: "India", lat: 13.3409, lon: 74.7421 },
  { name: "Chikmagalur", state: "Karnataka", country: "India", lat: 13.3161, lon: 75.7720 },
  { name: "Hubballi", state: "Karnataka", country: "India", lat: 15.3647, lon: 75.1240 },

  // Tamil Nadu
  { name: "Chennai", state: "Tamil Nadu", country: "India", lat: 13.0827, lon: 80.2707 },
  { name: "Madurai", state: "Tamil Nadu", country: "India", lat: 9.9252, lon: 78.1198 },
  { name: "Coimbatore", state: "Tamil Nadu", country: "India", lat: 11.0168, lon: 76.9558 },
  { name: "Ooty", state: "Tamil Nadu", country: "India", lat: 11.4102, lon: 76.6950 },
  { name: "Kodaikanal", state: "Tamil Nadu", country: "India", lat: 10.2381, lon: 77.4892 },
  { name: "Rameshwaram", state: "Tamil Nadu", country: "India", lat: 9.2876, lon: 79.3129 },
  { name: "Kanyakumari", state: "Tamil Nadu", country: "India", lat: 8.0883, lon: 77.5385 },
  { name: "Mahabalipuram", state: "Tamil Nadu", country: "India", lat: 12.6269, lon: 80.1927 },
  { name: "Tiruchirappalli", state: "Tamil Nadu", country: "India", lat: 10.7905, lon: 78.7047 },
  { name: "Thanjavur", state: "Tamil Nadu", country: "India", lat: 10.7870, lon: 79.1378 },

  // Kerala
  { name: "Kochi", state: "Kerala", country: "India", lat: 9.9312, lon: 76.2673 },
  { name: "Thiruvananthapuram", state: "Kerala", country: "India", lat: 8.5241, lon: 76.9366 },
  { name: "Munnar", state: "Kerala", country: "India", lat: 10.0889, lon: 77.0595 },
  { name: "Alleppey", state: "Kerala", country: "India", lat: 9.4981, lon: 76.3388 },
  { name: "Wayanad", state: "Kerala", country: "India", lat: 11.6854, lon: 76.1320 },
  { name: "Varkala", state: "Kerala", country: "India", lat: 8.7379, lon: 76.7163 },
  { name: "Kozhikode", state: "Kerala", country: "India", lat: 11.2588, lon: 75.7804 },
  { name: "Thekkady", state: "Kerala", country: "India", lat: 9.6031, lon: 77.1615 },
  { name: "Kovalam", state: "Kerala", country: "India", lat: 8.4004, lon: 76.9787 },

  // West Bengal
  { name: "Kolkata", state: "West Bengal", country: "India", lat: 22.5726, lon: 88.3639 },
  { name: "Darjeeling", state: "West Bengal", country: "India", lat: 27.0410, lon: 88.2663 },
  { name: "Siliguri", state: "West Bengal", country: "India", lat: 26.7271, lon: 88.3953 },
  { name: "Kalimpong", state: "West Bengal", country: "India", lat: 27.0667, lon: 88.4667 },
  { name: "Digha", state: "West Bengal", country: "India", lat: 21.6266, lon: 87.5074 },
  { name: "Howrah", state: "West Bengal", country: "India", lat: 22.5958, lon: 88.2636 },

  // Gujarat
  { name: "Ahmedabad", state: "Gujarat", country: "India", lat: 23.0225, lon: 72.5714 },
  { name: "Surat", state: "Gujarat", country: "India", lat: 21.1702, lon: 72.8311 },
  { name: "Vadodara", state: "Gujarat", country: "India", lat: 22.3072, lon: 73.1812 },
  { name: "Rajkot", state: "Gujarat", country: "India", lat: 22.3039, lon: 70.8022 },
  { name: "Gandhinagar", state: "Gujarat", country: "India", lat: 23.2156, lon: 72.6369 },
  { name: "Dwarka", state: "Gujarat", country: "India", lat: 22.2442, lon: 68.9685 },
  { name: "Somnath", state: "Gujarat", country: "India", lat: 20.8880, lon: 70.4012 },
  { name: "Bhuj", state: "Gujarat", country: "India", lat: 23.2420, lon: 69.6669 },
  { name: "Rann of Kutch", state: "Gujarat", country: "India", lat: 23.8346, lon: 69.8359 },

  // Madhya Pradesh
  { name: "Bhopal", state: "Madhya Pradesh", country: "India", lat: 23.2599, lon: 77.4126 },
  { name: "Indore", state: "Madhya Pradesh", country: "India", lat: 22.7196, lon: 75.8577 },
  { name: "Gwalior", state: "Madhya Pradesh", country: "India", lat: 26.2183, lon: 78.1828 },
  { name: "Khajuraho", state: "Madhya Pradesh", country: "India", lat: 24.8318, lon: 79.9199 },
  { name: "Ujjain", state: "Madhya Pradesh", country: "India", lat: 23.1765, lon: 75.7885 },
  { name: "Jabalpur", state: "Madhya Pradesh", country: "India", lat: 23.1815, lon: 79.9864 },
  { name: "Orchha", state: "Madhya Pradesh", country: "India", lat: 25.3516, lon: 78.6425 },
  { name: "Pachmarhi", state: "Madhya Pradesh", country: "India", lat: 22.4674, lon: 78.4346 },

  // Jammu & Kashmir / Ladakh
  { name: "Srinagar", state: "Jammu & Kashmir", country: "India", lat: 34.0837, lon: 74.7973 },
  { name: "Gulmarg", state: "Jammu & Kashmir", country: "India", lat: 34.0484, lon: 74.3805 },
  { name: "Pahalgam", state: "Jammu & Kashmir", country: "India", lat: 34.0163, lon: 75.1923 },
  { name: "Jammu", state: "Jammu & Kashmir", country: "India", lat: 32.7266, lon: 74.8570 },
  { name: "Sonamarg", state: "Jammu & Kashmir", country: "India", lat: 34.3000, lon: 75.2900 },
  { name: "Leh", state: "Ladakh", country: "India", lat: 34.1526, lon: 77.5771 },
  { name: "Nubra Valley", state: "Ladakh", country: "India", lat: 34.6863, lon: 77.5673 },

  // Punjab & Chandigarh
  { name: "Amritsar", state: "Punjab", country: "India", lat: 31.6340, lon: 74.8723 },
  { name: "Chandigarh", state: "Chandigarh", country: "India", lat: 30.7333, lon: 76.7794 },
  { name: "Ludhiana", state: "Punjab", country: "India", lat: 30.9010, lon: 75.8573 },
  { name: "Jalandhar", state: "Punjab", country: "India", lat: 31.3260, lon: 75.5762 },
  { name: "Patiala", state: "Punjab", country: "India", lat: 30.3398, lon: 76.3869 },

  // Telangana
  { name: "Hyderabad", state: "Telangana", country: "India", lat: 17.3850, lon: 78.4867 },
  { name: "Warangal", state: "Telangana", country: "India", lat: 17.9689, lon: 79.5941 },

  // Andhra Pradesh
  { name: "Visakhapatnam", state: "Andhra Pradesh", country: "India", lat: 17.6868, lon: 83.2185 },
  { name: "Vijayawada", state: "Andhra Pradesh", country: "India", lat: 16.5062, lon: 80.6480 },
  { name: "Tirupati", state: "Andhra Pradesh", country: "India", lat: 13.6288, lon: 79.4192 },
  { name: "Guntur", state: "Andhra Pradesh", country: "India", lat: 16.3067, lon: 80.4365 },

  // Bihar
  { name: "Patna", state: "Bihar", country: "India", lat: 25.5941, lon: 85.1376 },
  { name: "Bodh Gaya", state: "Bihar", country: "India", lat: 24.6961, lon: 84.9869 },
  { name: "Gaya", state: "Bihar", country: "India", lat: 24.7914, lon: 85.0002 },
  { name: "Rajgir", state: "Bihar", country: "India", lat: 25.0300, lon: 85.4200 },
  { name: "Nalanda", state: "Bihar", country: "India", lat: 25.1357, lon: 85.4436 },

  // Odisha
  { name: "Bhubaneswar", state: "Odisha", country: "India", lat: 20.2961, lon: 85.8245 },
  { name: "Puri", state: "Odisha", country: "India", lat: 19.8135, lon: 85.8312 },
  { name: "Konark", state: "Odisha", country: "India", lat: 19.8876, lon: 86.0945 },
  { name: "Cuttack", state: "Odisha", country: "India", lat: 20.4625, lon: 85.8828 },

  // North East India
  { name: "Guwahati", state: "Assam", country: "India", lat: 26.1445, lon: 91.7362 },
  { name: "Kaziranga", state: "Assam", country: "India", lat: 26.5775, lon: 93.1711 },
  { name: "Shillong", state: "Meghalaya", country: "India", lat: 25.5788, lon: 91.8933 },
  { name: "Cherrapunji", state: "Meghalaya", country: "India", lat: 25.2677, lon: 91.7323 },
  { name: "Gangtok", state: "Sikkim", country: "India", lat: 27.3389, lon: 88.6065 },
  { name: "Pelling", state: "Sikkim", country: "India", lat: 27.3000, lon: 88.2333 },

  // Chhattisgarh & Jharkhand
  { name: "Raipur", state: "Chhattisgarh", country: "India", lat: 21.2514, lon: 81.6296 },
  { name: "Ranchi", state: "Jharkhand", country: "India", lat: 23.3441, lon: 85.3096 },
  { name: "Jamshedpur", state: "Jharkhand", country: "India", lat: 22.8046, lon: 86.2029 },
  { name: "Deoghar", state: "Jharkhand", country: "India", lat: 24.4826, lon: 86.6975 },

  // Major Global Destinations
  { name: "Dubai", state: "Dubai", country: "United Arab Emirates", lat: 25.2048, lon: 55.2708 },
  { name: "Abu Dhabi", state: "Abu Dhabi", country: "United Arab Emirates", lat: 24.4539, lon: 54.3773 },
  { name: "Singapore", state: "Singapore", country: "Singapore", lat: 1.3521, lon: 103.8198 },
  { name: "Bangkok", state: "Bangkok", country: "Thailand", lat: 13.7563, lon: 100.5018 },
  { name: "Phuket", state: "Phuket", country: "Thailand", lat: 7.8804, lon: 98.3923 },
  { name: "Bali", state: "Bali", country: "Indonesia", lat: -8.4095, lon: 115.1889 },
  { name: "Kuala Lumpur", state: "Federal Territory", country: "Malaysia", lat: 3.1390, lon: 101.6869 },
  { name: "Tokyo", state: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503 },
  { name: "Kyoto", state: "Kyoto", country: "Japan", lat: 35.0116, lon: 135.7681 },
  { name: "London", state: "England", country: "United Kingdom", lat: 51.5074, lon: -0.1278 },
  { name: "Paris", state: "Île-de-France", country: "France", lat: 48.8566, lon: 2.3522 },
  { name: "Rome", state: "Lazio", country: "Italy", lat: 41.9028, lon: 12.4964 },
  { name: "Barcelona", state: "Catalonia", country: "Spain", lat: 41.3851, lon: 2.1734 },
  { name: "Amsterdam", state: "North Holland", country: "Netherlands", lat: 52.3676, lon: 4.9041 },
  { name: "New York", state: "New York", country: "United States", lat: 40.7128, lon: -74.0060 },
  { name: "San Francisco", state: "California", country: "United States", lat: 37.7749, lon: -122.4194 },
  { name: "Los Angeles", state: "California", country: "United States", lat: 34.0522, lon: -118.2437 },
  { name: "Sydney", state: "New South Wales", country: "Australia", lat: -33.8688, lon: 151.2093 },
  { name: "Toronto", state: "Ontario", country: "Canada", lat: 43.6532, lon: -79.3832 },
  { name: "Kathmandu", state: "Bagmati", country: "Nepal", lat: 27.7172, lon: 85.3240 },
  { name: "Colombo", state: "Western Province", country: "Sri Lanka", lat: 6.9271, lon: 79.8612 },
  { name: "Male", state: "Kaafu Atoll", country: "Maldives", lat: 4.1755, lon: 73.5093 },
  { name: "Doha", state: "Ad-Dawhah", country: "Qatar", lat: 25.2854, lon: 51.5310 },
];
