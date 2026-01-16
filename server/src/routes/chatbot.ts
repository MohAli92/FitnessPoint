import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { dbGet } from '../database';

const router = express.Router();

type Language = 'ar' | 'en' | 'de';

// Responses in different languages
const responses = {
  ar: {
    greetings: 'مرحباً! أنا مساعدك الذكي في FitnessPoint. كيف يمكنني مساعدتك اليوم؟',
    calories: 'يمكنك حساب السعرات الحرارية اليومية من صفحة "Calorie Calculator". هل تريد معرفة المزيد عن كيفية حساب السعرات؟',
    weightLoss: (goal: string) => goal === 'lose' 
      ? 'رائع! أنت بالفعل على المسار الصحيح. نصيحتي: ركز على عجز سعري بسيط (500-750 سعرة يومياً) مع تمارين المقاومة للحفاظ على العضلات.'
      : 'لخسارة الوزن، أنصحك بـ:\n• عجز سعري 500-750 سعرة يومياً\n• تمارين المقاومة 3-4 مرات أسبوعياً\n• المشي 10,000 خطوة يومياً\n• شرب 2-3 لتر ماء يومياً',
    weightGain: 'لزيادة الوزن بشكل صحي:\n• فائض سعري 300-500 سعرة يومياً\n• بروتين 1.6-2.2 جرام لكل كيلو\n• تمارين المقاومة الثقيلة\n• نوم 7-9 ساعات يومياً',
    exercise: 'يمكنك العثور على تمارين مناسبة لهدفك من صفحة "Fitness Tips". ما نوع التمارين التي تفضلها؟ (مقاومة، كارديو، مرونة)',
    protein: (weight?: number) => weight 
      ? `بناءً على وزنك (${weight} كجم)، أنصحك بتناول ${Math.round(weight * 1.6)}-${Math.round(weight * 2.2)} جرام بروتين يومياً.`
      : 'البروتين مهم جداً! أنصحك بتناول 1.6-2.2 جرام لكل كيلو من وزنك يومياً.',
    diet: 'نظام غذائي صحي يتكون من:\n• بروتين: لحوم، بيض، بقوليات\n• كربوهيدرات: أرز بني، بطاطا حلوة، شوفان\n• دهون صحية: أفوكادو، مكسرات، زيت زيتون\n• خضروات وفواكه متنوعة',
    help: 'يمكنني مساعدتك في:\n• حساب السعرات الحرارية\n• نصائح لخسارة أو زيادة الوزن\n• معلومات عن التمارين\n• نصائح غذائية\n• معلومات عن البروتين والماكروز\n\nما الذي تريد معرفته؟',
    profile: (user: any) => user 
      ? `بياناتك الحالية:\n• الاسم: ${user.username}\n• العمر: ${user.age || 'غير محدد'}\n• الطول: ${user.height || 'غير محدد'} سم\n• الوزن: ${user.weight || 'غير محدد'} كجم\n• الهدف: ${user.goal || 'غير محدد'}\n\nيمكنك تحديث بياناتك من صفحة Profile.`
      : 'يمكنك عرض وتحديث بياناتك من صفحة Profile في القائمة العلوية.',
    motivation: 'تذكر: الرحلة الطويلة تبدأ بخطوة واحدة! 🏃‍♂️\n\n• التقدم يأتي مع الاستمرارية\n• كل يوم هو فرصة جديدة\n• أنت أقوى مما تعتقد\n• النتائج تحتاج وقت وصبر\n\nاستمر! أنت على الطريق الصحيح 💪',
    default: 'شكراً لسؤالك! يمكنني مساعدتك في:\n• حساب السعرات الحرارية\n• نصائح اللياقة البدنية\n• معلومات عن التمارين\n• نصائح غذائية\n\nجرب أن تسأل عن: سعرات، تمرين، بروتين، أو نظام غذائي.'
  },
  en: {
    greetings: 'Hello! I\'m your smart assistant at FitnessPoint. How can I help you today?',
    calories: 'You can calculate your daily calories from the "Calorie Calculator" page. Would you like to know more about how to calculate calories?',
    weightLoss: (goal: string) => goal === 'lose'
      ? 'Great! You\'re already on the right track. My advice: focus on a moderate calorie deficit (500-750 calories daily) with resistance training to preserve muscle mass.'
      : 'For weight loss, I recommend:\n• Calorie deficit of 500-750 calories daily\n• Resistance training 3-4 times per week\n• Walking 10,000 steps daily\n• Drinking 2-3 liters of water daily',
    weightGain: 'For healthy weight gain:\n• Calorie surplus of 300-500 calories daily\n• Protein 1.6-2.2g per kg of body weight\n• Heavy resistance training\n• Sleep 7-9 hours daily',
    exercise: 'You can find exercises suitable for your goal from the "Fitness Tips" page. What type of exercises do you prefer? (resistance, cardio, flexibility)',
    protein: (weight?: number) => weight
      ? `Based on your weight (${weight} kg), I recommend consuming ${Math.round(weight * 1.6)}-${Math.round(weight * 2.2)} grams of protein daily.`
      : 'Protein is very important! I recommend consuming 1.6-2.2g per kg of your body weight daily.',
    diet: 'A healthy diet consists of:\n• Protein: meats, eggs, legumes\n• Carbohydrates: brown rice, sweet potatoes, oats\n• Healthy fats: avocado, nuts, olive oil\n• Variety of vegetables and fruits',
    help: 'I can help you with:\n• Calculating calories\n• Tips for weight loss or gain\n• Exercise information\n• Nutrition tips\n• Information about protein and macros\n\nWhat would you like to know?',
    profile: (user: any) => user
      ? `Your current data:\n• Name: ${user.username}\n• Age: ${user.age || 'Not set'}\n• Height: ${user.height || 'Not set'} cm\n• Weight: ${user.weight || 'Not set'} kg\n• Goal: ${user.goal || 'Not set'}\n\nYou can update your data from the Profile page.`
      : 'You can view and update your data from the Profile page in the top menu.',
    motivation: 'Remember: the long journey begins with a single step! 🏃‍♂️\n\n• Progress comes with consistency\n• Every day is a new opportunity\n• You are stronger than you think\n• Results take time and patience\n\nKeep going! You\'re on the right track 💪',
    default: 'Thanks for your question! I can help you with:\n• Calculating calories\n• Fitness tips\n• Exercise information\n• Nutrition tips\n\nTry asking about: calories, exercise, protein, or diet.'
  },
  de: {
    greetings: 'Hallo! Ich bin Ihr intelligenter Assistent bei FitnessPoint. Wie kann ich Ihnen heute helfen?',
    calories: 'Sie können Ihre täglichen Kalorien auf der Seite "Calorie Calculator" berechnen. Möchten Sie mehr darüber erfahren, wie man Kalorien berechnet?',
    weightLoss: (goal: string) => goal === 'lose'
      ? 'Großartig! Sie sind bereits auf dem richtigen Weg. Mein Rat: Konzentrieren Sie sich auf ein moderates Kaloriendefizit (500-750 Kalorien täglich) mit Krafttraining, um Muskelmasse zu erhalten.'
      : 'Für Gewichtsverlust empfehle ich:\n• Kaloriendefizit von 500-750 Kalorien täglich\n• Krafttraining 3-4 mal pro Woche\n• 10.000 Schritte täglich gehen\n• 2-3 Liter Wasser täglich trinken',
    weightGain: 'Für gesunde Gewichtszunahme:\n• Kalorienüberschuss von 300-500 Kalorien täglich\n• Protein 1,6-2,2g pro kg Körpergewicht\n• Schweres Krafttraining\n• 7-9 Stunden Schlaf täglich',
    exercise: 'Sie können Übungen finden, die für Ihr Ziel geeignet sind, auf der Seite "Fitness Tips". Welche Art von Übungen bevorzugen Sie? (Kraft, Cardio, Flexibilität)',
    protein: (weight?: number) => weight
      ? `Basierend auf Ihrem Gewicht (${weight} kg) empfehle ich, ${Math.round(weight * 1.6)}-${Math.round(weight * 2.2)} Gramm Protein täglich zu konsumieren.`
      : 'Protein ist sehr wichtig! Ich empfehle, 1,6-2,2g pro kg Ihres Körpergewichts täglich zu konsumieren.',
    diet: 'Eine gesunde Ernährung besteht aus:\n• Protein: Fleisch, Eier, Hülsenfrüchte\n• Kohlenhydrate: brauner Reis, Süßkartoffeln, Hafer\n• Gesunde Fette: Avocado, Nüsse, Olivenöl\n• Vielseitiges Gemüse und Obst',
    help: 'Ich kann Ihnen helfen bei:\n• Kalorienberechnung\n• Tipps zum Abnehmen oder Zunehmen\n• Trainingsinformationen\n• Ernährungstipps\n• Informationen über Protein und Makros\n\nWas möchten Sie wissen?',
    profile: (user: any) => user
      ? `Ihre aktuellen Daten:\n• Name: ${user.username}\n• Alter: ${user.age || 'Nicht festgelegt'}\n• Größe: ${user.height || 'Nicht festgelegt'} cm\n• Gewicht: ${user.weight || 'Nicht festgelegt'} kg\n• Ziel: ${user.goal || 'Nicht festgelegt'}\n\nSie können Ihre Daten auf der Profilseite aktualisieren.`
      : 'Sie können Ihre Daten auf der Profilseite im oberen Menü anzeigen und aktualisieren.',
    motivation: 'Denken Sie daran: Die lange Reise beginnt mit einem einzigen Schritt! 🏃‍♂️\n\n• Fortschritt kommt mit Beständigkeit\n• Jeder Tag ist eine neue Gelegenheit\n• Sie sind stärker, als Sie denken\n• Ergebnisse brauchen Zeit und Geduld\n\nWeiter so! Sie sind auf dem richtigen Weg 💪',
    default: 'Vielen Dank für Ihre Frage! Ich kann Ihnen helfen bei:\n• Kalorienberechnung\n• Fitness-Tipps\n• Trainingsinformationen\n• Ernährungstipps\n\nVersuchen Sie zu fragen nach: Kalorien, Training, Protein oder Ernährung.'
  }
};

// Simple chatbot responses based on keywords
const getChatBotResponse = async (message: string, language: Language = 'en', userId?: number): Promise<string> => {
  const lowerMessage = message.toLowerCase().trim();
  const user = userId ? await dbGet('SELECT * FROM users WHERE id = ?', [userId]) : null;
  const lang = responses[language];

  // Greetings
  if (lowerMessage.includes('مرحبا') || lowerMessage.includes('hello') || lowerMessage.includes('hi') || 
      lowerMessage.includes('السلام') || lowerMessage.includes('hallo') || lowerMessage.includes('guten tag')) {
    return lang.greetings;
  }

  // Calorie questions
  if (lowerMessage.includes('سعرات') || lowerMessage.includes('calories') || lowerMessage.includes('calorie') || 
      lowerMessage.includes('kalorien')) {
    return lang.calories;
  }

  // Weight loss
  if (lowerMessage.includes('نزول') || lowerMessage.includes('خسارة') || lowerMessage.includes('weight loss') || 
      lowerMessage.includes('lose weight') || lowerMessage.includes('abnehmen') || lowerMessage.includes('gewichtsverlust')) {
    return lang.weightLoss(user?.goal || '');
  }

  // Weight gain
  if (lowerMessage.includes('زيادة') || lowerMessage.includes('gain') || lowerMessage.includes('bulk') || 
      lowerMessage.includes('zunehmen') || lowerMessage.includes('gewichtszunahme')) {
    return lang.weightGain;
  }

  // Exercise questions
  if (lowerMessage.includes('تمرين') || lowerMessage.includes('exercise') || lowerMessage.includes('workout') || 
      lowerMessage.includes('übung') || lowerMessage.includes('training')) {
    return lang.exercise;
  }

  // Protein questions
  if (lowerMessage.includes('بروتين') || lowerMessage.includes('protein') || lowerMessage.includes('eiweiß')) {
    return lang.protein(user?.weight);
  }

  // Diet questions
  if (lowerMessage.includes('نظام') || lowerMessage.includes('diet') || lowerMessage.includes('طعام') || 
      lowerMessage.includes('food') || lowerMessage.includes('ernährung') || lowerMessage.includes('diät')) {
    return lang.diet;
  }

  // Help
  if (lowerMessage.includes('مساعدة') || lowerMessage.includes('help') || lowerMessage.includes('ماذا يمكنك') || 
      lowerMessage.includes('hilfe') || lowerMessage.includes('was kannst du')) {
    return lang.help;
  }

  // Profile questions
  if (lowerMessage.includes('الملف') || lowerMessage.includes('profile') || lowerMessage.includes('بياناتي') || 
      lowerMessage.includes('profil') || lowerMessage.includes('meine daten')) {
    return lang.profile(user);
  }

  // Motivation
  if (lowerMessage.includes('تحفيز') || lowerMessage.includes('motivation') || lowerMessage.includes('ملل') || 
      lowerMessage.includes('bored') || lowerMessage.includes('motivation') || lowerMessage.includes('langweilig')) {
    return lang.motivation;
  }

  // Default response
  return lang.default;
};

// ChatBot endpoint
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { message, language } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const lang: Language = ['ar', 'en', 'de'].includes(language) ? language : 'en';
    const response = await getChatBotResponse(message, lang, req.userId);

    res.json({ response });
  } catch (error: any) {
    console.error('ChatBot error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

export default router;
