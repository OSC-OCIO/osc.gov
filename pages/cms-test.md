---
cms_editable: true
title: cms-test
layout: layouts/default
eleventyNavigation: false
robots: noindex, nofollow
---

This is a sandbox page for trying Sveltia CMS body editing. Open **Pages → cms-test** in the CMS and use rich text mode to edit these examples or insert new ones.

## Text formatting

Try **bold text**, _italic text_, `inline code`, and [a link to the home page](/).

### Lists

- Edit this bullet.
- Add another item.

1. Try a numbered list.
2. Reorder or add items.

### Quote

> Replace this quotation with your own test text.

## Editable table

Click a cell to edit it. Use the table menu to add or remove rows and columns.

| Item | Description | Status |
| --- | --- | --- |
| Example one | Edit this cell | Ready |
| Example two | Add another row below | Testing |

## Image

Try replacing this image or inserting another image from the media library. Edit its alternative text too.

![Training illustration](/img/training.jpg)

## Code block

```text
Edit this sample code block.
Try adding another line.
```

## Horizontal rule

The line below is an editable horizontal rule.

***

Add more test content here.

## Card group

Use **Insert → USWDS Card Group** to add another group, or expand this group to edit its cards.

<!-- prettier-ignore-start -->

{% uswds_card_group %}
cards:
  - heading: "Test card"
    content: |-
      Edit this **card content** in the CMS.
    image:
      src: "/img/training.jpg"
      alt: "Training illustration"
    button:
      label: "Visit home"
      href: "/"
{% enduswds_card_group %}

<!-- prettier-ignore-end -->

## Summary box

Use **Insert → USWDS Summary Box** to add another box, or expand this example to edit its heading and content.

<!-- prettier-ignore-start -->

{% uswds_summary_box heading_level=3 %}
heading: "Key information"
content: |-
  Use this box to highlight **important information**.
  
  - Edit this item.
  - [Visit the home page](/).
{% enduswds_summary_box %}

<!-- prettier-ignore-end -->
