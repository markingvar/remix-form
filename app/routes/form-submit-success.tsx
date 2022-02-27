import { useEffect } from "react";
import {
  MetaFunction,
  LoaderFunction,
  json,
  useLoaderData,
  LinksFunction,
} from "remix";
import { destroySession, getSession } from "~/services/form/session.server";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import styles from "~/styles/routes/contact-received.css";

const metaTitle = "TODO - Fill in the title";
const metaDescription = "TODO - Fill in description";

export let meta: MetaFunction = () => {
  return {
    title: metaTitle,
    description: metaDescription,
    "og:type": "website",
    "og:url": "TODO - Fill in the page url",
    "og:title": metaTitle,
    "og:descripion": metaDescription,
    "og:image": "TODO - Fill in the open graph image - Cloudinary?",
    "og:image:width": "TODO - Fill in the image width",
    "og:image:height": "TODO - Fill in the image height",
    "og:image:alt": "TODO - Fill in the image alt",
    "og:site_name": metaTitle,
    "twitter:card": "summary_large_image",
    "twitter:image":
      "TODO - Fill in the twitter image src - can be the same as Cloudinary",
    "twitter:title": metaTitle,
    "twitter:creator": "@IngvarMark",
    "twitter:description": metaDescription,
  };
};

export let links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: styles,
    },
  ];
};

export const loader: LoaderFunction = async ({
  request,
}: {
  request: Request;
}) => {
  const session = await getSession(request.headers.get("Cookie"));

  let context = session.get("context");

  let dataHandlerSuccessMessage =
    context?.dataHandlerSuccessMessage ?? "We got your message";

  return json(
    {
      successMessage: dataHandlerSuccessMessage,
    },
    {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    }
  );
};

export default function ContactReceived() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  let { successMessage } = useLoaderData();
  return (
    <div className="contact-received-wrapper">
      <div className="icon-wrapper">
        <IoMdCheckmarkCircleOutline aria-hidden="true" />
      </div>
      <h2 className="success-message">{successMessage}</h2>
    </div>
  );
}
