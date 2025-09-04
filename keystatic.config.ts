// keystatic.config.ts
import { config, fields, collection } from "@keystatic/core";

const categoryOptions = [
  { label: "Web Development", value: "web-development" },
  { label: "Backend", value: "backend" },
];

export default config({
  storage: {
    kind: "local",
  },
  collections: {
    articles: collection({
      label: "Articles",
      slugField: "title",
      path: "src/content/articles/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        description: fields.text({ label: "Description" }),
        category: fields.select({
          options: categoryOptions,
          label: "Category",
          defaultValue: "web-development",
        }),
        date: fields.date({ label: "Date" }),
        image: fields.image({
          label: "Image",
          directory: "public/assets/articles",
          publicPath: "/assets/articles",
        }),
        draft: fields.checkbox({ label: "Draft" }),
        tools: fields.array(
          fields.relationship({
            label: "Tools",
            collection: "tools",
          }),
          {
            label: "Tools",
            itemLabel: (props) => props.value!,
          }
        ),
        content: fields.mdx({
          label: "Content",
          extension: "md",
          options: {
            image: {
              directory: "public/assets/articles",
              publicPath: "/assets/articles",
            },
          },
        }),
      },
    }),
    tools: collection({
      label: "Tools",
      slugField: "name",
      path: "src/content/tools/*",
      format: { data: "json" },
      schema: {
        name: fields.slug({ name: { label: "Tool Name" } }),
        logo: fields.image({
          label: "Logo",
          directory: "public/assets/tools",
          publicPath: "/assets/tools/",
        }),
        url: fields.url({ label: "Link" }),
      },
    }),
  },
});
