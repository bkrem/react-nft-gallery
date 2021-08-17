import React from 'react';
import { Meta, Story } from '@storybook/react';
import { NftGallery, NftGalleryProps } from '../src/';
import { version } from '../package.json';

const meta: Meta = {
  title: 'NftGallery',
  component: NftGallery,
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<NftGalleryProps> = (args) => <NftGallery {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const DefaultWithLatestMints = Template.bind({});
DefaultWithLatestMints.args = {};

export const DarkMode = Template.bind({});
DarkMode.args = { darkMode: true } as NftGalleryProps;

export const NoLightbox = Template.bind({});
NoLightbox.args = { hasLightbox: false } as NftGalleryProps;

export const Inline = Template.bind({});
Inline.args = { isInline: true } as NftGalleryProps;

export const ThreeArrowsCapitalShowAll = Template.bind({});
ThreeArrowsCapitalShowAll.args = {
  ownerAddress: '0x2e675eeae4747c248bfddbafaa3a8a2fdddaa44b',
} as NftGalleryProps;

const fidenzaContract = '0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270';
export const ThreeArrowsCapitalFidenzaShowcase = Template.bind({});
ThreeArrowsCapitalFidenzaShowcase.args = {
  ...ThreeArrowsCapitalShowAll.args,
  showcaseMode: true,
  showcaseItemIds: [
    fidenzaContract + '/78000817',
    fidenzaContract + '/78000370',
    fidenzaContract + '/78000821',
    fidenzaContract + '/78000145',
  ],
} as NftGalleryProps;
