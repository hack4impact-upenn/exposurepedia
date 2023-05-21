export interface DisorderTree {
  [key: string]: DisorderTree;
}
// TODO Kat: replace with exposure/disorders (and delete this file)
const masterDisorderObject: DisorderTree = {
  'Body Dysmorphia': {},
  'Generalized Anxiety': {},
  'Health Anxiety/Medical Phobia': {
    'Blood/Injection/Injury': {},
    'Dental Phobia': {},
  },
  Hoarding: {},
  'Obsessive Compulsive Disorder (OCD)': {
    'Aggressive/Violent': {
      'Fear of Being a Sociopath/Murderer': {},
      'Fear of a Hit-and-Run': {},
      'Fear of Self-Harm': {},
    },
    Checking: {},
    Contamination: {},
    Existential: {
      'Fear of Wasting Time': {},
    },
    'Fear of Acting on Unwanted Impulses': {},
    'Fear of Being Cancelled': {},
    'Fear of Being Misunderstood': {},
    'Fear of Contracting Sexually-Transmitted Diseases/HIV/AIDs': {},
    'Fear of Developing Other Types of OCD': {},
    'Fear of Forgetting': {},
    'Fear of Getting in Trouble': {},
    'Fear of Going Crazy': {},
    'Fear of Making the Wrong Decision': {
      'Fear of Buying the Wrong Thing': {},
    },
    'Fear of Unintentionally Causing Harm': {},
    'Magical Numbers': {},
    'Need to Know': {},
    'Not Just Right': {},
    Perfectionism: {},
    'Relationship OCD': {
      'Retractive Jealousy': {},
    },
    'Scrupulosity/Morality': {
      'Fear of Being Racist': {},
      'Fear of Sinning': {},
    },
    'Sexual/Gender': {
      'Fear of Being Gay/Straight': {},
      'Fear of Being Trans': {},
      'Fear of Being a Pedophile': {},
    },
    'Somatic OCD': {},
    'Symmetry/Ordering': {},
    'Fear of Uncertainty': {},
  },
  'Panic/Agoraphobia': {},
  'Specific Phobia': {
    Animals: {
      Birds: {},
      Bugs: {},
      Cats: {},
      Dogs: {},
      Fish: {},
      'Mice/Rats': {},
      Sharks: {},
      Snakes: {},
    },
    Claustriphobia: {},
    Choking: {},
    Dark: {},
    Driving: {},
    Flying: {},
    Heights: {},
    'Storms/Natural Disasters': {},
    Trypophobia: {},
    'Vomit (Emetophobia)': {},
  },
  'Posttraumatic Stress Disorder (PTSD)': {
    'Combat/Military/Terrorism': {},
    'Sexual Assault': {},
    'Car Accident': {},
  },
  'Separation Anxiety': {},
  'Social Anxiety': {},
  'Trichotillomania/Excoriation': {},
};

export default masterDisorderObject;
