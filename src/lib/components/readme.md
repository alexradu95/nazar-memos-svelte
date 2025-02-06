# Atomic Design Components

This project follows atomic design principles adapted for SvelteKit to create a scalable and maintainable component library.

## Structure

```
components/
├── atoms/       # Basic building blocks
├── molecules/   # Groups of atoms
└── organisms/   # Groups of molecules
```

## Component Types

### Atoms
- Smallest possible components
- Single HTML elements enhanced with styles and basic functionality
- Examples: Button, Input, Label, Icon, TagBadge
- Found in `atoms/` directory

### Molecules
- Simple groups of atoms working together
- Have a single responsibility
- Examples: MemoHeader, TagList, FormField
- Found in `molecules/` directory

### Organisms
- Complex UI components
- Composed of molecules and atoms
- Examples: MemoCard, Navigation, SearchSection
- Found in `organisms/` directory

## Best Practices

1. **Component Isolation**
   - Each component should work independently
   - Use props for configuration
   - Avoid direct dependencies on global state

2. **Props Interface**
   ```typescript
   interface Props {
     // Required props
     label: string;
     // Optional props with defaults
     variant?: 'primary' | 'secondary' = 'primary';
   }
   ```

3. **Component Documentation**
   - Document props and usage
   - Include examples
   - Note any dependencies

4. **Testing**
   - Unit test atoms and molecules
   - Integration test organisms
   - E2E test at the route level

## Usage Example

```svelte
<!-- atoms/TagBadge.svelte -->
<script lang="ts">
  export let name: string;
  export let color: string;
</script>

<span class="badge" style="--color: {color}">
  {name}
</span>

<!-- molecules/TagList.svelte -->
<script lang="ts">
  import TagBadge from '../atoms/TagBadge.svelte';
  export let tags: Array<{name: string, color: string}>;
</script>

<div class="tag-list">
  {#each tags as tag}
    <TagBadge {...tag} />
  {/each}
</div>
```

## SvelteKit Integration

- Components are imported into route files (`+page.svelte`, `+layout.svelte`)
- Route-specific components should live in the respective route directory
- Shared components belong in `lib/components/`
- Use `$lib` alias for importing components

## Benefits

- **Reusability**: Components are designed for reuse
- **Consistency**: Shared atoms ensure UI consistency
- **Maintenance**: Easier to update and modify
- **Testing**: Isolated components are easier to test
- **Documentation**: Clear component hierarchy
- **Collaboration**: Better team understanding