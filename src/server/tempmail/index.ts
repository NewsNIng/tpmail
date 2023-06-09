import axios from "axios";
import { prisma } from "../db";
import { type TempMailInbox } from "@prisma/client";

export async function tempMailCreate({ userId }: { userId: string }) {
  const options = {
    method: "POST",
    url: "https://temp-mail44.p.rapidapi.com/api/v3/email/new",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": "3055243c93mshca2e7592aa0ae9fp1f5818jsn64984e0ee0d7",
      "X-RapidAPI-Host": "temp-mail44.p.rapidapi.com",
    },
    data: {
      key1: "value",
      key2: "value",
    },
  };

  try {
    const response = await axios.request(options);
    const { email, token } = response.data as {
      email: string;
      token: string;
    };

    return await prisma.tempMail.create({
      data: {
        email,
        token,
        userId,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export async function tempMailInbox({ email }: { email: string }) {
  const options = {
    method: "GET",
    url: `https://temp-mail44.p.rapidapi.com/api/v3/email/${email}/messages`,
    headers: {
      "X-RapidAPI-Key": "3055243c93mshca2e7592aa0ae9fp1f5818jsn64984e0ee0d7",
      "X-RapidAPI-Host": "temp-mail44.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    const inbox = response.data as TempMailInbox[];
    return inbox.map((item) => {
      const attachments = item.attachments
        ? JSON.stringify(item.attachments)
        : null;
      return {
        ...item,
        attachments,
      };
    });
  } catch (error) {
    console.error(error);
  }
}
