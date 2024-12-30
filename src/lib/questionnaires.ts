import frame from '../../public/images/on-board/Frame.svg';
import frame1 from '../../public/images/on-board/Frame (1).svg';
import frame2 from '../../public/images/on-board/Frame (2).svg';
import frame3 from '../../public/images/on-board/Frame (3).svg';
import frame4 from '../../public/images/on-board/Frame (4).svg';
import frame5 from '../../public/images/on-board/Frame (5).svg';
import frame6 from '../../public/images/on-board/Frame (6).svg';

export const questionnaires = [
  {
    question: 'Health and Family',
    answers: [
      'Have children aged 11 years or younger',
      'I have children aged 12 or older with special care needs',
      /* 'Have additional travel distance or expenses related to dropping off the child in a child day care centre or after-school supervision scheme', */
      'I am a single parent',
    ],
    icon: frame,
  },
  {
    question: 'Bank and Loans',
    answers: [
      'Have a loan',
      'Have refinanced a loan in the last year',
      'Have taken out a joint loan with someone',
      'Have young people’s housing savings (BSU)',
      'I have sold shares or securities at a loss',
    ],
    icon: frame1,
  },
  {
    question: 'Work and Education',
    answers: [
      'Moved for a new job',
      'I work as a fisherman',
      'I work as a seafarer',
      'I went to school last year',
      'I am a foreign employee',
      'The return distance between home and work is more than 37 kilometres',
      'Have expenses for road toll or ferry when travelling between your home and workplace',
      'I stay away from home overnight because of work',
      'Member of Trade Union',
      'living in Norway only in a part of a year',
      'Disputation of a PhD',
      'Have a separate room in your house used only as your home office',
    ],
    icon: frame2,
  },
  {
    question: 'Housing and Property',
    answers: [
      'Housing in a housing association housing company or jointly owned property',
      'I have rented out a residential property or a holiday home',
      'Sold a residential property or holiday home profit or loss',
    ],
    icon: frame3,
  },
  {
    question: 'Gifts or Donations',
    answers: ['Gifts to voluntary organisations'],
    icon: frame4,
  },
  {
    question: 'Hobby, Odd Jobs, and Extra Incomes',
    answers: [
      'I have a sole proprietorship',
      'Sell goods or services blog/influencer practise e-sports (gaming) breed animals on a small scale',
      'I have received salary from odd jobs and services',
    ],
    icon: frame5,
  },
  {
    question: 'Foreign Income',
    answers: [
      'Have income or wealth in another country than Norway and pay tax in the other country',
    ],
    icon: frame6,
  },
];
