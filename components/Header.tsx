import React from 'react';
import Head from 'next/head';

interface Props {
  title?: string;
  description?: string;
  image?: string;
}

export const CommonHead = ({ title, description, image }: Props) => (
  <Head>
    <title>
      {title || 'Name The Code | Algorithm and data structure guessing game'}
    </title>
    <meta
      key="description"
      name="description"
      property="description"
      content={
        description ||
        'Algorithm and data structure guessing game. Play and test your algorithm and data structure knowledge.'
      }
    />
    <meta
      key="image"
      name="og:image"
      property="og:image"
      content={image || 'https://namethecode.now.sh/static/images/banner.png'}
    />
  </Head>
);
