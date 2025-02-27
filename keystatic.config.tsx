import { collection, config, fields } from "@keystatic/core";

export default config({
  storage: {
    kind: "github",
    repo: {
      owner: "namesakefyi",
      name: "namesake.fyi",
    },
    branchPrefix: "keystatic/",
  },

  collections: {
    authors: collection({
      label: "Authors",
      slugField: "name",
      columns: ["name", "role", "bio"],
      path: "src/content/authors/*",
      schema: {
        name: fields.slug({
          name: { label: "Name", validation: { isRequired: true } },
        }),
        role: fields.text({
          label: "Role",
          description: "Should be in the format of 'Role, Organization'",
          validation: { isRequired: true },
        }),
        bio: fields.text({
          label: "Bio",
          description: "Provide name, pronouns, and a brief bio.",
          multiline: true,
          validation: { isRequired: true },
        }),
        avatar: fields.image({
          label: "Avatar",
          directory: "src/assets/images/authors",
          publicPath: "../../assets/images/authors/",
          validation: { isRequired: true },
        }),
        socialLinks: fields.array(
          fields.object({
            name: fields.select({
              label: "Name",
              options: [
                { label: "Bluesky", value: "Bluesky" },
                { label: "GitHub", value: "GitHub" },
                { label: "Instagram", value: "Instagram" },
                { label: "LinkedIn", value: "LinkedIn" },
                { label: "Website", value: "Website" },
              ],
              defaultValue: "Website",
            }),
            url: fields.url({ label: "URL" }),
          }),
          {
            label: "Social Links",
            itemLabel: (props) =>
              `${props.fields.name.value}: ${props.fields.url.value}`,
          },
        ),
      },
    }),

    partners: collection({
      label: "Partners",
      slugField: "name",
      columns: ["name"],
      path: "src/content/partners/*",
      schema: {
        name: fields.slug({
          name: { label: "Name", validation: { isRequired: true } },
        }),
        logo: fields.image({
          label: "Logo",
          description:
            "Logo should be solid black and edge-to-edge (no extra whitespace). SVG format preferred.",
          directory: "src/assets/images/partners",
          publicPath: "../../assets/images/partners/",
          validation: { isRequired: true },
        }),
        url: fields.url({
          label: "URL",
          validation: { isRequired: true },
        }),
        height: fields.integer({
          label: "Height",
          description:
            "Height in pixels. Used to make all logos consume similar amounts of visual space despite different dimensions. Value should be between 40 and 80.",
          validation: { isRequired: true },
        }),
      },
    }),

    posts: collection({
      label: "Posts",
      slugField: "title",
      columns: ["title", "description", "publishDate"],
      path: "src/content/posts/*",
      format: { contentField: "content" },
      entryLayout: "content",
      schema: {
        title: fields.slug({
          name: { label: "Title", validation: { isRequired: true } },
        }),
        description: fields.text({
          label: "Description",
          description: "Should be between 70 and 160 characters.",
          multiline: true,
          validation: { isRequired: true, length: { min: 70, max: 160 } },
        }),
        publishDate: fields.date({
          label: "Publish Date",
          validation: { isRequired: true },
        }),
        authors: fields.array(
          fields.relationship({ label: "Authors", collection: "authors" }),
          {
            label: "Authors",
            itemLabel: (props) => props.value ?? "Unknown",
          },
        ),
        image: fields.conditional(
          fields.checkbox({ label: "Include image?", defaultValue: false }),
          {
            true: fields.object({
              src: fields.image({
                label: "Image",
                description:
                  "Images will automatically have filters applied to match the background color of the page.",
                directory: "src/assets/images/posts",
                publicPath: "../../assets/images/posts/",
              }),
              alt: fields.text({
                label: "Alt Text",
              }),
            }),
            false: fields.empty(),
          },
        ),
        content: fields.markdoc({
          label: "Content",
          extension: "md",
          options: {
            image: {
              directory: "src/assets/images/posts",
              publicPath: "../../assets/images/posts/",
            },
          },
        }),
      },
    }),

    press: collection({
      label: "Press",
      slugField: "title",
      columns: ["title", "date", "outlet"],
      path: "src/content/press/*",
      schema: {
        title: fields.slug({
          name: { label: "Title", validation: { isRequired: true } },
        }),
        date: fields.date({
          label: "Date published",
          validation: { isRequired: true },
        }),
        url: fields.url({
          label: "URL",
          description: "Link to the press article",
          validation: { isRequired: true },
        }),
        outlet: fields.text({
          label: "Outlet",
          description:
            "The name of the publication (use full spelling, no acronyms)",
          validation: { isRequired: true },
        }),
        image: fields.conditional(
          fields.checkbox({ label: "Include image?", defaultValue: false }),
          {
            true: fields.object({
              src: fields.image({
                label: "Image",
                directory: "src/assets/images/press",
                publicPath: "../../assets/images/press/",
              }),
              alt: fields.text({
                label: "Alt Text",
              }),
            }),
            false: fields.empty(),
          },
        ),
      },
    }),
  },

  ui: {
    brand: {
      name: " ",
      mark: () => (
        <svg
          width={120}
          height={20}
          viewBox="0 0 120 24"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Namesake</title>
          <path d="M99.8096 23.6139H93.3431C93.2543 23.6139 93.1823 23.5419 93.1823 23.4531V22.8418C93.1823 22.7848 93.2125 22.732 93.2617 22.7031L94.6622 21.8811V1.77071L93.0117 0.91492C92.9584 0.887265 92.9249 0.832195 92.9249 0.772118V0.160858C92.9249 0.0720186 92.9969 0 93.0858 0H98.3941C98.4829 0 98.5549 0.0720186 98.5549 0.160858V15.2092L102.913 9.79313L101.466 8.95416C101.417 8.92538 101.386 8.87237 101.386 8.81501V8.20375C101.386 8.11491 101.458 8.04289 101.547 8.04289H107.08C107.169 8.04289 107.241 8.11491 107.241 8.20375V8.81501C107.241 8.87797 107.205 8.93514 107.147 8.96131L104.928 9.97568L101.871 13.626L106.585 21.8845L108.152 22.6991C108.205 22.7268 108.239 22.7818 108.239 22.8418V23.4531C108.239 23.5419 108.167 23.6139 108.078 23.6139H101.29C101.201 23.6139 101.129 23.5419 101.129 23.4531V22.8418C101.129 22.7884 101.155 22.7384 101.199 22.7085L102.266 21.9878L98.5549 15.5011V21.8832L99.8937 22.7047C99.9414 22.734 99.9705 22.7859 99.9705 22.8418V23.4531C99.9705 23.5419 99.8984 23.6139 99.8096 23.6139Z" />
          <path d="M111.63 15.4463L119.476 15.6353C119.519 15.6364 119.561 15.6199 119.592 15.5896C119.623 15.5594 119.64 15.5179 119.64 15.4745V14.6059C119.64 12.4434 119.128 10.6985 118.166 9.49088C117.199 8.27848 115.791 7.62467 114.043 7.62467C110.29 7.62467 107.544 10.8805 107.544 15.6354C107.544 18.489 108.208 20.5826 109.388 21.965C110.571 23.3512 112.252 24 114.236 24C115.52 24 116.566 23.6616 117.428 23.0623C118.287 22.4644 118.954 21.6133 119.493 20.601C119.508 20.5731 119.514 20.5415 119.511 20.51L119.414 19.5127C119.406 19.4302 119.337 19.3673 119.254 19.3673H118.804C118.752 19.3673 118.703 19.3923 118.673 19.4344C117.464 21.121 116.316 21.9088 114.879 21.9088C113.46 21.9088 112.447 20.9499 112.01 19.3883L112.01 19.3874C111.822 18.7299 111.63 17.4586 111.63 15.9249V15.4463ZM111.664 14.1148L115.747 13.9062C115.739 13.1836 115.677 12.0242 115.588 11.2819C115.493 10.6478 115.329 10.0825 115.048 9.67889C114.774 9.28427 114.388 9.04022 113.817 9.04022C113.3 9.04022 112.91 9.2881 112.607 9.69169C112.301 10.0996 112.09 10.6607 111.948 11.2612C111.801 12.0585 111.68 13.3502 111.664 14.1148Z" />
          <path d="M82.2387 15.1614C83.7087 14.3345 85.6004 14.044 87.3685 14.0276V11.4531C87.3685 10.7561 87.1826 10.1689 86.839 9.7588C86.5 9.35418 85.9949 9.10667 85.3182 9.10457C84.1993 9.22901 83.1842 10.0179 82.5598 11.0404L81.761 13.2451C81.7379 13.3088 81.6775 13.3512 81.6098 13.3512H80.902C80.8132 13.3512 80.7411 13.2792 80.7411 13.1903V9.10456C80.7411 9.04971 80.7691 8.99864 80.8153 8.96907C81.6404 8.441 83.6325 7.59249 85.7599 7.59249C87.743 7.59249 89.1177 8.02291 90.0003 8.70374C90.8876 9.38822 91.2613 10.3137 91.2613 11.2601V21.8821L92.6309 22.7039C92.6793 22.733 92.709 22.7853 92.709 22.8418V23.4531C92.709 23.5419 92.637 23.6139 92.5481 23.6139H87.6259C87.537 23.6139 87.465 23.5419 87.465 23.4531V22.1006C86.5155 23.3427 85.1986 23.9678 83.6688 23.9678C82.6327 23.9678 81.6234 23.7214 80.8717 23.0547C80.1163 22.3846 79.6473 21.3137 79.6473 19.7212C79.6473 17.4548 80.7122 16.0201 82.2387 15.1614ZM85.2452 21.6836C86.2465 21.6836 87.025 21.0156 87.3685 20.3886V15.353C86.1041 15.4196 85.1745 15.7275 84.5544 16.3041C83.9109 16.9025 83.5722 17.8172 83.5722 19.1421C83.5722 20.1469 83.7253 20.7877 84.0006 21.1717C84.2654 21.5411 84.6638 21.6989 85.2409 21.6837L85.2452 21.6836Z" />
          <path d="M69.8794 20.3874C70.6708 21.5174 72.0044 22.5201 73.3057 22.5201C74.0322 22.5201 74.6606 22.3114 75.1044 21.9385C75.5452 21.5681 75.8151 21.0267 75.8151 20.3324C75.8151 19.9349 75.7408 19.6109 75.6009 19.3356C75.4609 19.0603 75.2507 18.8248 74.9665 18.6112C74.3916 18.179 73.5326 17.8485 72.3877 17.4614C71.3813 17.1528 70.3478 16.7009 69.5653 15.9267C68.7768 15.1466 68.2548 14.0509 68.2548 12.4826C68.2548 11.0099 68.7936 9.78421 69.7006 8.92731C70.6067 8.07133 71.8704 7.59249 73.3057 7.59249C75.3632 7.59249 76.7081 8.11589 77.6284 8.60888C77.6806 8.63688 77.7133 8.69137 77.7133 8.75067V12.9008C77.7133 12.9896 77.6412 13.0617 77.5524 13.0617H76.909C76.8415 13.0617 76.7812 13.0195 76.7579 12.9562L76.0571 11.0449C75.3073 9.95643 74.5085 9.28846 73.2262 9.04024C72.4731 9.04291 71.9167 9.24409 71.5502 9.56707C71.1833 9.89033 70.9894 10.3506 70.9894 10.9062C70.9894 11.6719 71.3002 12.1906 71.8097 12.5983C72.3288 13.0135 73.0514 13.3112 73.8727 13.6172C75.2579 14.0524 76.4453 14.5515 77.2852 15.3499C78.1345 16.1572 78.6141 17.2556 78.6141 18.8525C78.6141 21.5781 76.5809 23.9678 73.2092 23.9678C71.0585 23.9678 69.2318 23.3818 68.149 22.824C68.0954 22.7964 68.0618 22.7412 68.0618 22.681V18.1448C68.0618 18.0559 68.1338 17.9839 68.2226 17.9839H68.9304C68.9989 17.9839 69.0599 18.0273 69.0824 18.092L69.8794 20.3874Z" />
          <path d="M66.5999 15.6353L58.7539 15.4463V15.9249C58.7539 17.4586 58.9459 18.7299 59.1337 19.3874L59.134 19.3883C59.5712 20.9499 60.5843 21.9088 62.0032 21.9088C63.4399 21.9088 64.5882 21.121 65.7974 19.4344C65.8276 19.3923 65.8763 19.3673 65.9281 19.3673H66.3785C66.4614 19.3673 66.5307 19.4302 66.5387 19.5127L66.6352 20.51C66.6382 20.5415 66.6319 20.5731 66.6171 20.601C66.0783 21.6133 65.4117 22.4644 64.5522 23.0623C63.6907 23.6616 62.6447 24 61.3598 24C59.3767 24 57.695 23.3512 56.5122 21.965C55.3326 20.5826 54.6681 18.489 54.6681 15.6354C54.6681 10.8805 57.4144 7.62467 61.1667 7.62467C62.9156 7.62467 64.3233 8.27848 65.2898 9.49088C66.2527 10.6985 66.7646 12.4434 66.7646 14.6059V15.4745C66.7646 15.5179 66.7471 15.5594 66.7161 15.5896C66.6851 15.6199 66.6432 15.6364 66.5999 15.6353ZM62.8709 13.9062L58.788 14.1148C58.8047 13.3501 58.9249 12.0583 59.0722 11.261C59.2147 10.6606 59.4252 10.0996 59.7311 9.69169C60.0338 9.2881 60.4242 9.04022 60.9415 9.04022C61.512 9.04022 61.8987 9.28427 62.1727 9.67889C62.4529 10.0824 62.6171 10.6476 62.7124 11.2816C62.8013 12.0239 62.8629 13.1835 62.8709 13.9062Z" />
          <path d="M32.9917 21.8811L31.5912 22.7031C31.542 22.732 31.5118 22.7848 31.5118 22.8418V23.4531C31.5118 23.5419 31.5838 23.6139 31.6727 23.6139H38.1392C38.228 23.6139 38.3 23.5419 38.3 23.4531V22.8418C38.3 22.7859 38.271 22.734 38.2233 22.7047L36.8845 21.8832V11.9432C37.1014 11.5372 37.4497 11.0958 37.8741 10.754C38.3112 10.4019 38.8155 10.1662 39.3295 10.1662C39.8642 10.1662 40.2325 10.3107 40.4698 10.5687C40.7095 10.8292 40.8416 11.2334 40.8416 11.807V21.8843L39.5335 22.7056C39.4866 22.735 39.4582 22.7865 39.4582 22.8418V23.4531C39.4582 23.5419 39.5302 23.6139 39.6191 23.6139H45.989C46.0779 23.6139 46.1499 23.5419 46.1499 23.4531V22.8418C46.1499 22.7859 46.1208 22.734 46.0732 22.7047L44.7343 21.8832V11.9122C44.9663 11.4905 45.3148 11.0568 45.7345 10.727C46.1662 10.3879 46.663 10.1662 47.1794 10.1662C47.7141 10.1662 48.0917 10.3108 48.3374 10.5704C48.5846 10.8315 48.7236 11.2355 48.7236 11.807V21.8832L47.3848 22.7047C47.3371 22.734 47.3081 22.7859 47.3081 22.8418V23.4531C47.3081 23.5419 47.3801 23.6139 47.4689 23.6139H53.9032C53.9921 23.6139 54.0641 23.5419 54.0641 23.4531V22.8418C54.0641 22.7848 54.0339 22.732 53.9847 22.7031L52.5842 21.8811V11.3244C52.5842 9.16543 50.8277 7.65684 48.7558 7.65684C47.7931 7.65684 46.9975 7.89837 46.2897 8.37164C45.6602 8.79256 45.1068 9.39233 44.5674 10.1526C44.0838 8.77882 42.7298 7.65684 40.8416 7.65684C39.8611 7.65684 39.0725 7.91545 38.3846 8.39779C37.8189 8.79449 37.3267 9.33874 36.8523 10.0015V8.20376C36.8523 8.11492 36.7803 8.0429 36.6914 8.0429H31.6083C31.5195 8.0429 31.4475 8.11492 31.4475 8.20376V8.81502C31.4475 8.87313 31.4788 8.92673 31.5295 8.95522L32.9917 9.77773V21.8811Z" />
          <path d="M20.4717 15.1614C21.9418 14.3345 23.8335 14.044 25.6016 14.0276V11.4531C25.6016 10.7561 25.4156 10.1689 25.0721 9.7588C24.7331 9.35418 24.228 9.10667 23.5512 9.10457C22.4323 9.22901 21.4173 10.0179 20.7929 11.0404L19.9941 13.2451C19.971 13.3088 19.9105 13.3512 19.8428 13.3512H19.1351C19.0462 13.3512 18.9742 13.2792 18.9742 13.1903V9.10456C18.9742 9.04971 19.0021 8.99864 19.0483 8.96907C19.8735 8.441 21.8656 7.59249 23.993 7.59249C25.9761 7.59249 27.3508 8.02291 28.2333 8.70374C29.1206 9.38822 29.4943 10.3137 29.4943 11.2601V21.8821L30.8639 22.7039C30.9124 22.733 30.942 22.7853 30.942 22.8418V23.4531C30.942 23.5419 30.87 23.6139 30.7812 23.6139H25.8589C25.7701 23.6139 25.6981 23.5419 25.6981 23.4531V22.1006C24.7485 23.3427 23.4317 23.9678 21.9018 23.9678C20.8658 23.9678 19.8564 23.7214 19.1047 23.0547C18.3494 22.3846 17.8804 21.3137 17.8804 19.7212C17.8804 17.4548 18.9453 16.0201 20.4717 15.1614ZM23.4782 21.6836C24.4796 21.6836 25.2581 21.0156 25.6016 20.3886V15.353C24.3372 15.4196 23.4076 15.7275 22.7875 16.3041C22.1439 16.9025 21.8053 17.8172 21.8053 19.1421C21.8053 20.1469 21.9583 20.7877 22.2336 21.1717C22.4984 21.5411 22.8969 21.6989 23.474 21.6837L23.4782 21.6836Z" />
          <path d="M3.82842 4.3871L13.4001 23.7175C13.4272 23.7723 13.4831 23.807 13.5442 23.807H15.3137C15.4025 23.807 15.4745 23.735 15.4745 23.6461V2.90043L17.4741 1.9468C17.53 1.92011 17.5657 1.86362 17.5657 1.80161V1.15818C17.5657 1.06934 17.4937 0.997323 17.4048 0.997323H11.807C11.7181 0.997323 11.6461 1.06934 11.6461 1.15818V1.80161C11.6461 1.86396 11.6821 1.9207 11.7386 1.94721L13.7694 2.90109V15.0853L6.73893 1.08599C6.71163 1.03163 6.656 0.997323 6.59518 0.997323H0.193029C0.10419 0.997323 0.0321723 1.06934 0.0321723 1.15818V1.80161C0.0321723 1.8651 0.0695122 1.92265 0.12749 1.94851L2.12332 2.83896V21.7102L0.0924717 22.6641C0.0360344 22.6906 0 22.7473 0 22.8097V23.4531C0 23.5419 0.0720191 23.6139 0.160859 23.6139H5.79089C5.87973 23.6139 5.95174 23.5419 5.95174 23.4531V22.8097C5.95174 22.7473 5.91571 22.6906 5.85927 22.6641L3.82842 21.7102V4.3871Z" />
        </svg>
      ),
    },
  },
});
