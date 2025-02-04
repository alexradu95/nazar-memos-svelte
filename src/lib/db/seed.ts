// src/lib/db/seed.ts
import { db } from './index';
import * as schema from './schema';

export async function seed() {
  // Insert test users
  const [john, jane, bob] = await db.insert(schema.users).values([
    {
      username: 'john_doe',
      email: 'john@example.com',
      passwordHash: '$2a$10$ABC...',
      settingsJson: JSON.stringify({ theme: 'dark', notifications: true })
    },
    {
      username: 'jane_smith',
      email: 'jane@example.com',
      passwordHash: '$2a$10$DEF...',
      settingsJson: JSON.stringify({ theme: 'light', notifications: false })
    },
    {
      username: 'bob_wilson',
      email: 'bob@example.com',
      passwordHash: '$2a$10$GHI...',
      settingsJson: JSON.stringify({ theme: 'dark', notifications: true })
    }
  ]).returning();

  // Insert test memos
  const [projectMemo, meetingMemo, shoppingMemo, blogMemo] = await db.insert(schema.memos).values([
    {
      userId: john.id,
      title: 'Project Ideas',
      content: 'List of potential projects:\n1. Mobile app\n2. Web service',
      visibility: 'private',
      pinned: 1
    },
    {
      userId: john.id,
      title: 'Meeting Notes',
      content: 'Team meeting discussion points...',
      visibility: 'private',
      pinned: 0
    },
    {
      userId: jane.id,
      title: 'Shopping List',
      content: 'Groceries to buy:\n- Milk\n- Bread',
      visibility: 'private',
      pinned: 0
    },
    {
      userId: bob.id,
      title: 'Tech Blog Post',
      content: 'Draft for upcoming blog post about SQLite...',
      visibility: 'public',
      pinned: 1
    }
  ]).returning();

  // Insert test resources
  await db.insert(schema.resources).values([
    {
      memoId: projectMemo.id,
      filename: 'diagram.png',
      filePath: '/uploads/2024/01/diagram.png',
      mimeType: 'image/png',
      size: 15360
    },
    {
      memoId: projectMemo.id,
      filename: 'proposal.pdf',
      filePath: '/uploads/2024/01/proposal.pdf',
      mimeType: 'application/pdf',
      size: 52428
    },
    {
      memoId: blogMemo.id,
      filename: 'code-sample.js',
      filePath: '/uploads/2024/01/code.js',
      mimeType: 'text/javascript',
      size: 2048
    }
  ]);

  // Insert test tags
  const [workTag, personalTag, shoppingTag, blogTag] = await db.insert(schema.tags).values([
    { userId: john.id, name: 'work', color: '#ff0000' },
    { userId: john.id, name: 'personal', color: '#00ff00' },
    { userId: jane.id, name: 'shopping', color: '#0000ff' },
    { userId: bob.id, name: 'blog', color: '#purple' }
  ]).returning();

  // Insert memo-tag relations
  await db.insert(schema.memoTags).values([
    { memoId: projectMemo.id, tagId: workTag.id },
    { memoId: meetingMemo.id, tagId: workTag.id },
    { memoId: shoppingMemo.id, tagId: shoppingTag.id },
    { memoId: blogMemo.id, tagId: blogTag.id }
  ]);

  // Insert test AI interactions
  const [projectAI, blogAI] = await db.insert(schema.aiInteractions).values([
    {
      memoId: projectMemo.id,
      agentType: 'summarizer',
      query: 'Summarize this project list',
      response: 'Two potential projects: mobile app and web service development.',
      contextJson: JSON.stringify({ mode: 'concise' })
    },
    {
      memoId: blogMemo.id,
      agentType: 'editor',
      query: 'Improve the writing style',
      response: 'Enhanced blog post content suggestions...',
      contextJson: JSON.stringify({ style: 'technical' })
    }
  ]).returning();

  // Insert test AI followups
  await db.insert(schema.aiFollowups).values([
    {
      interactionId: projectAI.id,
      question: 'Which project should I prioritize?',
      response: 'Based on the context, the mobile app seems more urgent.'
    },
    {
      interactionId: projectAI.id,
      question: 'What resources would I need?',
      response: 'For the mobile app: mobile developers, UI/UX designer, backend infrastructure.'
    },
    {
      interactionId: blogAI.id,
      question: 'Can you make it more beginner-friendly?',
      response: 'Modified content to include more explanations of technical terms.'
    }
  ]);
}