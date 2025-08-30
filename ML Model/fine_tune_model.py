# --- Step 1: All Necessary Imports ---
import torch
from sentence_transformers import SentenceTransformer, InputExample, losses, models
from torch.utils.data import DataLoader
from datasets import load_dataset
import os

# --- Step 2: Load the Pre-trained Model ---
# We start with the same lightweight model you've been using.
model_name = 'all-MiniLM-L6-v2'
print(f"Loading pre-trained model: {model_name}")

# Use a transformer model and a pooling layer to create the base SentenceTransformer
word_embedding_model = models.Transformer(model_name)
pooling_model = models.Pooling(word_embedding_model.get_word_embedding_dimension())
model = SentenceTransformer(modules=[word_embedding_model, pooling_model])

# --- Step 3: Prepare the Dataset ---
print("Downloading and preparing the SNLI dataset...")
# We'll use the 'datasets' library to automatically download and load the SNLI dataset.
train_dataset = load_dataset('snli', split='train')

# The training process needs a list of InputExample objects.
# We will use sentence pairs labeled as "entailment" (label=0) as positive pairs.
train_examples = []
for record in train_dataset:
    # Skip pairs that have no label (-1)
    if record['label'] == 0: # 0 indicates entailment (the sentences mean the same thing)
        train_examples.append(InputExample(texts=[record['premise'], record['hypothesis']]))

print(f"✅ Dataset ready. Created {len(train_examples)} training examples.")

# --- Step 4: Define the Dataloader and Loss Function ---
# The dataloader will batch the examples for efficient training.
train_dataloader = DataLoader(train_examples, shuffle=True, batch_size=16)

# MultipleNegativesRankingLoss is a great loss function for this task.
# It tries to push semantically similar sentences closer together and dissimilar sentences further apart.
train_loss = losses.MultipleNegativesRankingLoss(model=model)

# --- Step 5: Run the Fine-Tuning ---
# We will train for just one epoch, which is enough to see an improvement.
num_epochs = 1
warmup_steps = int(len(train_dataloader) * num_epochs * 0.1) # 10% of train data for warm-up

print("\nStarting the fine-tuning process...")
model.fit(train_objectives=[(train_dataloader, train_loss)],
          epochs=num_epochs,
          warmup_steps=warmup_steps,
          output_path='./output', # The fine-tuned model will be saved here
          show_progress_bar=True)

print("\n✅ Fine-tuning complete!")
print("Your new, improved model has been saved to the './output' folder.")