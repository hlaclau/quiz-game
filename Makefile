.PHONY: mermaid mermaid-install help

# Default target
.DEFAULT_GOAL := help

# Variables
MERMAID_DIR := docs/mermaid
OUTPUT_DIR := .resources/mermaid

help: ## Show this help message
	@echo "Available targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

mermaid-install: ## Install Mermaid CLI (requires Node.js)
	@echo "Installing Mermaid CLI..."
	@npm install --save-dev @mermaid-js/mermaid-cli@latest
	@echo "✅ Mermaid CLI installed"

# Temporary file for extracted mermaid code
MERMAID_TEMP := $(OUTPUT_DIR)/mermaid-temp.mmd

mermaid: ## Generate Mermaid SVG from all .md files in docs/mermaid/
	@echo "Generating Mermaid diagrams from $(MERMAID_DIR)/..."
	@mkdir -p $(OUTPUT_DIR)
	@if [ ! -d "$(MERMAID_DIR)" ]; then \
		echo "❌ Error: $(MERMAID_DIR) directory not found"; \
		exit 1; \
	fi
	@for md_file in $(MERMAID_DIR)/*.md; do \
		if [ -f "$$md_file" ]; then \
			basename=$$(basename "$$md_file" .md); \
			output_file="$(OUTPUT_DIR)/$$basename.svg"; \
			echo "Processing $$md_file -> $$output_file"; \
			awk '/^```mermaid$$/,/^```$$/' "$$md_file" | sed '/^```/d' > $(MERMAID_TEMP) || \
				(echo "⚠️  Warning: No Mermaid code found in $$md_file" && continue); \
			if [ -s $(MERMAID_TEMP) ]; then \
				if command -v npx > /dev/null; then \
					npx --yes @mermaid-js/mermaid-cli@latest \
						-i $(MERMAID_TEMP) \
						-o "$$output_file" \
						-b transparent \
						-w 1200 \
						-H 800 && \
					echo "✅ Generated: $$output_file"; \
				elif [ -f node_modules/.bin/mmdc ]; then \
					./node_modules/.bin/mmdc \
						-i $(MERMAID_TEMP) \
						-o "$$output_file" \
						-b transparent \
						-w 1200 \
						-H 800 && \
					echo "✅ Generated: $$output_file"; \
				else \
					echo "❌ Error: Mermaid CLI not found."; \
					echo "   Install it with: make mermaid-install"; \
					echo "   Or ensure Node.js and npx are installed"; \
					rm -f $(MERMAID_TEMP); \
					exit 1; \
				fi \
			fi; \
			rm -f $(MERMAID_TEMP); \
		fi; \
	done
	@echo ""
	@echo "📊 Generated SVG files:"
	@ls -lh $(OUTPUT_DIR)/*.svg 2>/dev/null || echo "No SVG files found"

mermaid-clean: ## Remove generated Mermaid SVG files
	@echo "Cleaning Mermaid diagrams..."
	@rm -rf $(OUTPUT_DIR)
	@rm -f $(MERMAID_TEMP)
	@echo "✅ Cleaned $(OUTPUT_DIR)"

