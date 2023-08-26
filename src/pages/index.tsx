import Head from "next/head";
import LayOut from "~/components/LayOut";

export default function Home() {
  return (
    <>
      <Head>
        <title>Chat GPT - clone </title>
        <meta name="description" content="Chat GPT clone side project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LayOut>
        <div></div>
      </LayOut>
    </>
  );
}
