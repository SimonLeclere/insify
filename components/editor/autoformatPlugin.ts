'use client';

import type { AutoformatRule } from '@udecode/plate-autoformat';

import {
  autoformatArrow,
  autoformatLegal,
  autoformatLegalHtml,
  autoformatMath,
  autoformatPunctuation,
  autoformatSmartQuotes,
} from '@udecode/plate-autoformat';
import { AutoformatPlugin } from '@udecode/plate-autoformat/react';
import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  UnderlinePlugin,
} from '@udecode/plate-basic-marks/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { insertEmptyCodeBlock } from '@udecode/plate-code-block';
import { CodeBlockPlugin } from '@udecode/plate-code-block/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { ParagraphPlugin } from '@udecode/plate/react';

const autoformatMarks: AutoformatRule[] = [
  {
    match: '***',
    mode: 'mark',
    type: [BoldPlugin.key, ItalicPlugin.key],
  },
  {
    match: '__*',
    mode: 'mark',
    type: [UnderlinePlugin.key, ItalicPlugin.key],
  },
  {
    match: '__**',
    mode: 'mark',
    type: [UnderlinePlugin.key, BoldPlugin.key],
  },
  {
    match: '___***',
    mode: 'mark',
    type: [UnderlinePlugin.key, BoldPlugin.key, ItalicPlugin.key],
  },
  {
    match: '**',
    mode: 'mark',
    type: BoldPlugin.key,
  },
  {
    match: '__',
    mode: 'mark',
    type: UnderlinePlugin.key,
  },
  {
    match: '*',
    mode: 'mark',
    type: ItalicPlugin.key,
  },
  {
    match: '_',
    mode: 'mark',
    type: ItalicPlugin.key,
  },
  {
    match: '~~',
    mode: 'mark',
    type: StrikethroughPlugin.key,
  },
  {
    match: '^',
    mode: 'mark',
    type: SuperscriptPlugin.key,
  },
  {
    match: '~',
    mode: 'mark',
    type: SubscriptPlugin.key,
  },
  {
    match: '`',
    mode: 'mark',
    type: CodePlugin.key,
  },
];

const autoformatBlocks: AutoformatRule[] = [
  {
    match: '# ',
    mode: 'block',
    type: HEADING_KEYS.h1,
  },
  {
    match: '## ',
    mode: 'block',
    type: HEADING_KEYS.h2,
  },
  {
    match: '### ',
    mode: 'block',
    type: HEADING_KEYS.h3,
  },
  {
    match: '#### ',
    mode: 'block',
    type: HEADING_KEYS.h4,
  },
  {
    match: '##### ',
    mode: 'block',
    type: HEADING_KEYS.h5,
  },
  {
    match: '###### ',
    mode: 'block',
    type: HEADING_KEYS.h6,
  },
  {
    match: '> ',
    mode: 'block',
    type: BlockquotePlugin.key,
  },
  {
    match: '```',
    mode: 'block',
    type: CodeBlockPlugin.key,
    format: (editor) => {
      insertEmptyCodeBlock(editor, {
        defaultType: ParagraphPlugin.key,
        insertNodesOptions: { select: true },
      });
    },
  },
];

export const autoformatPlugin = AutoformatPlugin.configure({
  options: {
    enableUndoOnDelete: true,
    rules: [
      ...autoformatBlocks,
      ...autoformatMarks,
      ...autoformatSmartQuotes,
      ...autoformatPunctuation,
      ...autoformatLegal,
      ...autoformatLegalHtml,
      ...autoformatArrow,
      ...autoformatMath,
    ].map(
      (rule): AutoformatRule => ({
        ...rule,
        query: (editor) =>
          !editor.api.some({
            match: { type: editor.getType(CodeBlockPlugin) },
          }),
      })
    ),
  },
});
