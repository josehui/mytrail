import { Footprint } from '@prisma/client';

const nodemailer = require('nodemailer');

export const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.SOS_EMAIL_USER,
    pass: process.env.SOS_EMAIL_PASSWORD,
  },
});

export const sosEmailOption = (recipents: string, subject: string, message: string) => ({
  from: process.env.SOS_EMAIL_USER,
  bcc: recipents,
  subject,
  html: message,
});

export const createSOSEmail = (userName: string, lastFootprint: Footprint) => {
  const offlineHour = Math.round((new Date().getTime() - lastFootprint.createdAt.getTime()) / 36e5);
  const fpDetails = `${process.env.HOST_URL}/fp/${lastFootprint.id}`;
  return `<h2>SOS - ${userName} has been offline for over ${offlineHour} hours</h2>
  <p>Last seen: ${lastFootprint.createdAt.toUTCString()}</p>
  <p>Location: ${lastFootprint.address}</p>
  <p>Details: <a href=${fpDetails}> ${fpDetails}</a></p>
  <h3>Please try to reach them/ contact emergency services</h3>
  <br/>
  <p>**This is an automated message**</p>`;
};
