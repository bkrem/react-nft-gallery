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

export const VitalikENS = Template.bind({});
VitalikENS.args = {
  ownerAddress: 'vitalik.eth',
} as NftGalleryProps;

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
    '78000005',
    '78000031',
    '78000526',
    '78000097',
    '78000805',
    '78000821',
    '78000098',
    '78000410',
    '78000145',
    '78000370',
    '78000479',
    '78000817',
    '78000943',
    '78000861',
    '78000083',
    '78000795',
    '78000203',
    '78000871',
    '78000221',
    '78000169',
    '78000002',
    '78000713',
    '78000729',
    '78000256',
    '78000290',
    '78000216',
    '78000725',
    '78000721',
    '78000644',
    '78000471',
    '78000228',
    '78000005',
    '78000031',
    '78000526',
    '78000097',
    '78000805',
    '78000821',
    '78000098',
    '78000410',
    '78000145',
    '78000370',
    '78000479',
    '78000817',
    '78000943',
    '78000861',
    '78000083',
    '78000795',
    '78000203',
    '78000871',
    '78000221',
    '78000169',
    '78000002',
    '78000713',
    '78000729',
    '78000256',
    '78000290',
    '78000216',
    '78000725',
    '78000721',
    '78000644',
    '78000471',
    '78000228',
  ].map((id) => `${fidenzaContract}/${id}`),
} as NftGalleryProps;
