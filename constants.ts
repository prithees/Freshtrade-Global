export const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQe4_WGIhX4dJ0NjUFm_U8TT22YbJBcFRmV_BZaG2i5lO9YXWbnvJ41MxbvkG27-fcLTGGZsrdBh-CV/pub?gid=0&single=true&output=csv';
// Instructions for client:
// 1. Open your Google Sheet.
// 2. Go to File > Share > Publish to web.
// 3. In the dialog, select the correct sheet (e.g., "Products").
// 4. Select "Comma-separated values (.csv)" format.
// 5. Click "Publish".
// 6. Copy the generated link and replace the GOOGLE_SHEET_URL value above.

export const CAREERS_GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSezcIHHTgFDF7K52A7ejtuXekPnd2TnQGq-xjFRpbzQnqkrQw/viewform?usp=dialog';
// Replace with the client's Google Form link for job applications.

export const CONTACT_FORM_ENDPOINT = 'https://formspree.io/f/xqadjgqr'; 
// Replace with the client's Formspree endpoint.

export const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Products', path: '/products' },
  { name: 'Careers', path: '/careers' },
  { name: 'Contact', path: '/contact' },
];

export const ALL_NAV_LINKS = [
  ...NAV_LINKS,
  { name: 'Careers', path: '/careers' },
  { name: 'Contact', path: '/contact' },
]

export const CURRENCY_RATES = {
  SGD: 0.016, // Singapore Dollar
  INR: 1,     // Indian Rupee (Base)
  USD: 0.012, // US Dollar
  EUR: 0.011, // Euro
  PKR: 3.34,  // Pakistani Rupee
};

export const CURRENCY_SYMBOLS = {
  SGD: 'S$',
  INR: '₹',
  USD: '$',
  EUR: '€',
  PKR: '₨',
};
