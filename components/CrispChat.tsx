"use client";
import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("dd9aac39-87d4-47d1-93ab-594a4076f280");
  }, []);

  return null;
};
