export const SUBJECTS = [
  'Operating Systems',
  'DBMS',
  'Computer Networks',
  'OOPs',
  'DSA Theory and Complexity',
  'Aptitude and Logical Reasoning',
  'System Design Concepts',
]

export const DSA_PROBLEMS = {
  easy: [
    { slug: 'two-sum', title: 'Two Sum', url: 'https://leetcode.com/problems/two-sum/', difficulty: 'Easy' },
    { slug: 'valid-parentheses', title: 'Valid Parentheses', url: 'https://leetcode.com/problems/valid-parentheses/', difficulty: 'Easy' },
    { slug: 'reverse-linked-list', title: 'Reverse Linked List', url: 'https://leetcode.com/problems/reverse-linked-list/', difficulty: 'Easy' },
    { slug: 'best-time-to-buy-and-sell-stock', title: 'Best Time to Buy and Sell Stock', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', difficulty: 'Easy' },
    { slug: 'climbing-stairs', title: 'Climbing Stairs', url: 'https://leetcode.com/problems/climbing-stairs/', difficulty: 'Easy' },
    { slug: 'merge-two-sorted-lists', title: 'Merge Two Sorted Lists', url: 'https://leetcode.com/problems/merge-two-sorted-lists/', difficulty: 'Easy' },
    { slug: 'maximum-subarray', title: 'Maximum Subarray', url: 'https://leetcode.com/problems/maximum-subarray/', difficulty: 'Easy' },
  ],
  medium: [
    { slug: 'longest-substring-without-repeating-characters', title: 'Longest Substring Without Repeating Characters', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', difficulty: 'Medium' },
    { slug: '3sum', title: '3Sum', url: 'https://leetcode.com/problems/3sum/', difficulty: 'Medium' },
    { slug: 'binary-tree-level-order-traversal', title: 'Binary Tree Level Order Traversal', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', difficulty: 'Medium' },
    { slug: 'word-search', title: 'Word Search', url: 'https://leetcode.com/problems/word-search/', difficulty: 'Medium' },
    { slug: 'coin-change', title: 'Coin Change', url: 'https://leetcode.com/problems/coin-change/', difficulty: 'Medium' },
    { slug: 'product-of-array-except-self', title: 'Product of Array Except Self', url: 'https://leetcode.com/problems/product-of-array-except-self/', difficulty: 'Medium' },
    { slug: 'number-of-islands', title: 'Number of Islands', url: 'https://leetcode.com/problems/number-of-islands/', difficulty: 'Medium' },
  ],
  hard: [
    { slug: 'trapping-rain-water', title: 'Trapping Rain Water', url: 'https://leetcode.com/problems/trapping-rain-water/', difficulty: 'Hard' },
    { slug: 'median-of-two-sorted-arrays', title: 'Median of Two Sorted Arrays', url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/', difficulty: 'Hard' },
    { slug: 'word-ladder', title: 'Word Ladder', url: 'https://leetcode.com/problems/word-ladder/', difficulty: 'Hard' },
    { slug: 'serialize-and-deserialize-binary-tree', title: 'Serialize and Deserialize Binary Tree', url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/', difficulty: 'Hard' },
    { slug: 'alien-dictionary', title: 'Alien Dictionary', url: 'https://leetcode.com/problems/alien-dictionary/', difficulty: 'Hard' },
  ],
}

export function pickDSAProblems(mcqScore, seenSlugs = []) {
  let tiers
  if (mcqScore <= 4) tiers = ['easy', 'easy']
  else if (mcqScore <= 7) tiers = ['easy', 'medium']
  else tiers = ['medium', 'hard']

  return tiers.map(tier => {
    const unseen = DSA_PROBLEMS[tier].filter(p => !seenSlugs.includes(p.slug))
    const pool = unseen.length ? unseen : DSA_PROBLEMS[tier]
    return pool[Math.floor(Math.random() * pool.length)]
  })
}
