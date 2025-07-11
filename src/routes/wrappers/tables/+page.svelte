<script lang="ts">
	import ToggleSwitch from '$buttons/ToggleSwitch.svelte';
	import { enumerate_runed_properties, get_max } from '$functions/helpers.svelte';
	import Input from '$inputs/Input.svelte';
	import Table, { type DataCell } from '$wrappers/Table.svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import { fly } from 'svelte/transition';

	function get_random_date() {
		const start = new Date(1950, 0, 1);
		const end = new Date();
		return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
	}
	function find_age_in_years(birthday: Date, today: Date) {
		return Math.floor((today.getTime() - birthday.getTime()) / (1000 * 60 * 60 * 24 * 365));
	}
	const names = [
		'John',
		'Jane',
		'Bob',
		'Alice',
		'Charlie',
		'David',
		'Eve',
		'Frank',
		'Grace',
		'Henry',
		'Ivy',
		'Jack',
		'Kate',
		'Luke',
		'Mary',
		'Nancy',
		'Olivia',
		'Peter',
		'Quinn',
		'Rose',
		'Sam',
		'Tom',
		'Ursula',
		'Violet',
		'Walter',
		'Xavier',
		'Yvonne',
		'Zoe'
	];
	class Person {
		id: string = $state<string>(crypto.randomUUID());
		name: string = $state('');
		birthday: Date = $state(get_random_date());
		name_length: number = $derived(this.name.length);
		age: number = $derived(find_age_in_years(this.birthday, new Date()));
		say_name = async () => {
			console.log(this.name);
		};

		constructor(initial_name: string) {
			this.name = initial_name;
			enumerate_runed_properties(this);
		}
	}
	class Player {
		nickname: string = $state('');
		name: string = $state('');
		email: string = $state('');
		balance: number = $state(0);
		joined: boolean = $state(false);

		constructor(initial_name: string) {
			this.nickname = make_random_nickname(initial_name);
			this.name = initial_name;
			this.email = make_random_email(initial_name);
			this.balance = Math.floor(Math.random() * 1000);
			this.joined = Math.random() < 0.5;
			enumerate_runed_properties(this);
		}
	}

	function make_random_nickname(name: string) {
		// Username generation patterns
		const patterns = [
			// Adjective + Noun combinations
			() => {
				const adjectives = [
					'Cool',
					'Epic',
					'Awesome',
					'Mega',
					'Super',
					'Ultra',
					'Dark',
					'Light',
					'Swift',
					'Quick',
					'Fast',
					'Slow',
					'Big',
					'Small',
					'Tiny',
					'Huge',
					'Wild',
					'Crazy',
					'Silly',
					'Funny',
					'Serious',
					'Quiet',
					'Loud',
					'Bright',
					'Dull',
					'Sharp',
					'Blunt',
					'Sweet',
					'Sour',
					'Spicy',
					'Fresh',
					'Old',
					'New',
					'Young',
					'Ancient',
					'Modern',
					'Classic'
				];
				const nouns = [
					'Dragon',
					'Phoenix',
					'Wolf',
					'Eagle',
					'Lion',
					'Tiger',
					'Bear',
					'Shark',
					'Whale',
					'Dolphin',
					'Penguin',
					'Owl',
					'Raven',
					'Crow',
					'Knight',
					'Wizard',
					'Warrior',
					'Archer',
					'Mage',
					'Paladin',
					'Ninja',
					'Samurai',
					'Viking',
					'Pirate',
					'Cowboy',
					'Spaceman',
					'Robot',
					'Cyborg',
					'Alien',
					'Ghost',
					'Vampire',
					'Zombie',
					'Gamer',
					'Coder',
					'Hacker',
					'Artist',
					'Musician',
					'Chef',
					'Explorer',
					'Adventurer',
					'Traveler',
					'Pilot',
					'Captain'
				];
				const adjective = adjectives[Math.floor(Math.random() * adjectives.length)] || 'Cool';
				const noun = nouns[Math.floor(Math.random() * nouns.length)] || 'Dragon';
				return adjective + noun;
			},
			// Name + Number combinations
			() => {
				const numbers = Math.floor(Math.random() * 999) + 1;
				return name.replace(/\s+/g, '') + numbers;
			},
			// Name with special characters
			() => {
				const specials = ['_', 'x', 'X', '.', '-'];
				const special = specials[Math.floor(Math.random() * specials.length)];
				const numbers = Math.floor(Math.random() * 99) + 1;
				return name.replace(/\s+/g, '') + special + numbers;
			},
			// Gaming-style usernames
			() => {
				const prefixes = ['The', 'Mr', 'Ms', 'Dr', 'Prof', 'Lord', 'Lady'];
				const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
				const suffixes = ['Gaming', 'Pro', 'Elite', 'Master', 'Legend', 'Hero'];
				const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
				return prefix + name.replace(/\s+/g, '') + suffix;
			},
			// Tech-style usernames
			() => {
				const techWords = [
					'Byte',
					'Bit',
					'Code',
					'Script',
					'Dev',
					'Hack',
					'Tech',
					'Net',
					'Web',
					'App'
				];
				const techWord = techWords[Math.floor(Math.random() * techWords.length)];
				const numbers = Math.floor(Math.random() * 999) + 1;
				return name.replace(/\s+/g, '') + techWord + numbers;
			},
			// Emoji-style (text-based)
			() => {
				const emojis = [':)', ':D', ';)', ':P', 'xD', '^_^', '>_<', 'o_O'];
				const emoji = emojis[Math.floor(Math.random() * emojis.length)];
				return name.replace(/\s+/g, '') + emoji;
			},
			// Leetspeak variations
			() => {
				const leetMap: Record<string, string> = {
					a: '4',
					e: '3',
					i: '1',
					o: '0',
					s: '5',
					t: '7'
				};
				let leetName = name.toLowerCase().replace(/\s+/g, '');
				for (const [letter, number] of Object.entries(leetMap)) {
					if (Math.random() < 0.3) {
						// 30% chance to replace each letter
						leetName = leetName.replace(new RegExp(letter, 'g'), number);
					}
				}
				return leetName;
			},
			// All caps with numbers
			() => {
				const numbers = Math.floor(Math.random() * 999) + 1;
				return name.replace(/\s+/g, '').toUpperCase() + numbers;
			},
			// Reversed name
			() => {
				const reversed = name.replace(/\s+/g, '').split('').reverse().join('');
				const numbers = Math.floor(Math.random() * 99) + 1;
				return reversed + numbers;
			},
			// Name with random letters
			() => {
				const randomLetters = Math.random().toString(36).substring(2, 6);
				return name.replace(/\s+/g, '') + randomLetters;
			}
		];

		// Randomly select a pattern
		const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
		return selectedPattern?.() || 'CoolDragon';
	}

	function make_random_email(name: string) {
		// Email generation patterns
		const emailPatterns = [
			// Standard name@domain.com
			() => {
				const domains = [
					'gmail.com',
					'yahoo.com',
					'hotmail.com',
					'outlook.com',
					'icloud.com',
					'protonmail.com',
					'fastmail.com',
					'mail.com',
					'live.com',
					'aol.com',
					'me.com',
					'mac.com',
					'rocketmail.com',
					'earthlink.net',
					'verizon.net'
				];
				const domain = domains[Math.floor(Math.random() * domains.length)] || 'gmail.com';
				const cleanName = name.toLowerCase().replace(/\s+/g, '');
				return `${cleanName}@${domain}`;
			},
			// Name with numbers
			() => {
				const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
				const domain = domains[Math.floor(Math.random() * domains.length)] || 'gmail.com';
				const numbers = Math.floor(Math.random() * 999) + 1;
				const cleanName = name.toLowerCase().replace(/\s+/g, '');
				return `${cleanName}${numbers}@${domain}`;
			},
			// Name with dots
			() => {
				const domains = ['gmail.com', 'yahoo.com', 'hotmail.com'];
				const domain = domains[Math.floor(Math.random() * domains.length)] || 'gmail.com';
				const cleanName = name.toLowerCase().replace(/\s+/g, '.');
				return `${cleanName}@${domain}`;
			},
			// Name with underscores
			() => {
				const domains = ['gmail.com', 'yahoo.com', 'outlook.com'];
				const domain = domains[Math.floor(Math.random() * domains.length)] || 'gmail.com';
				const cleanName = name.toLowerCase().replace(/\s+/g, '_');
				return `${cleanName}@${domain}`;
			},
			// Name with random letters
			() => {
				const domains = ['gmail.com', 'yahoo.com'];
				const domain = domains[Math.floor(Math.random() * domains.length)] || 'gmail.com';
				const randomLetters = Math.random().toString(36).substring(2, 5);
				const cleanName = name.toLowerCase().replace(/\s+/g, '');
				return `${cleanName}${randomLetters}@${domain}`;
			},
			// First letter + last name
			() => {
				const domains = ['gmail.com', 'yahoo.com', 'hotmail.com'];
				const domain = domains[Math.floor(Math.random() * domains.length)] || 'gmail.com';
				const nameParts = name.split(' ');
				if (nameParts.length > 1) {
					const firstInitial = (nameParts[0] || '').charAt(0).toLowerCase() || 'j';
					const lastName = (nameParts[nameParts.length - 1] || 'doe').toLowerCase();
					return `${firstInitial}${lastName}@${domain}`;
				} else {
					return `${name.toLowerCase()}@${domain}`;
				}
			},
			// Professional style (firstname.lastname)
			() => {
				const domains = ['company.com', 'corp.com', 'business.com', 'enterprise.com'];
				const domain = domains[Math.floor(Math.random() * domains.length)] || 'company.com';
				const nameParts = name.split(' ');
				if (nameParts.length > 1) {
					const firstName = (nameParts[0] || 'john').toLowerCase();
					const lastName = (nameParts[nameParts.length - 1] || 'doe').toLowerCase();
					return `${firstName}.${lastName}@${domain}`;
				} else {
					return `${name.toLowerCase()}@${domain}`;
				}
			},
			// Gaming style
			() => {
				const domains = ['gaming.com', 'game.com', 'play.com', 'fun.com'];
				const domain = domains[Math.floor(Math.random() * domains.length)] || 'gaming.com';
				const cleanName = name.toLowerCase().replace(/\s+/g, '');
				const numbers = Math.floor(Math.random() * 999) + 1;
				return `${cleanName}${numbers}@${domain}`;
			},
			// Tech style
			() => {
				const domains = ['tech.com', 'dev.com', 'code.com', 'hack.com'];
				const domain = domains[Math.floor(Math.random() * domains.length)] || 'tech.com';
				const techWords = ['dev', 'coder', 'hacker', 'tech', 'geek'];
				const techWord = techWords[Math.floor(Math.random() * techWords.length)];
				const cleanName = name.toLowerCase().replace(/\s+/g, '');
				return `${cleanName}.${techWord}@${domain}`;
			},
			// Year-based
			() => {
				const domains = ['gmail.com', 'yahoo.com', 'hotmail.com'];
				const domain = domains[Math.floor(Math.random() * domains.length)] || 'gmail.com';
				const year = Math.floor(Math.random() * 20) + 2000; // 2000-2019
				const cleanName = name.toLowerCase().replace(/\s+/g, '');
				return `${cleanName}${year}@${domain}`;
			}
		];

		// Randomly select an email pattern
		const selectedPattern = emailPatterns[Math.floor(Math.random() * emailPatterns.length)];
		return selectedPattern?.() || `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`;
	}

	let data = $state<Person[]>(names.map((name) => new Person(name)));
	let players = $state<Player[]>([
		...names.map((name) => new Player(name)),
		...names.map((name) => new Player(name))
	]);
	let bg = $derived(
		new MediaQuery('(prefers-color-scheme: dark)').current
			? 'var(--dark-background)'
			: 'var(--background)'
	);
</script>

{#snippet custom_data_cell({ datum, key }: DataCell<Person>)}
	{#if key === 'birthday'}
		<td>
			<Input
				type="date"
				value={datum.birthday.toISOString().split('T')[0]}
				oninput={(e) => (datum.birthday = new Date(e?.currentTarget.value))}
			/>
		</td>
	{:else if key === 'age'}
		<td style:--lightness={datum.age / get_max(data.map((d) => d.age))}>
			<div class="shared-grid age">
				{#key datum.age}
					<output in:fly={{ x: -50 }} out:fly={{ x: 50 }}>
						{datum.age}
					</output>
				{/key}
			</div>
		</td>
	{:else if key === 'name_length'}
		<td>
			<div class="shared-grid name-length">
				{#key datum.name_length}
					<output in:fly={{ x: -50 }} out:fly={{ x: 50 }}>
						{datum.name_length}
					</output>
				{/key}
			</div>
		</td>
	{:else if key === 'name'}
		<td>
			<Input type="text" bind:value={datum.name} />
		</td>
	{/if}
{/snippet}

<div class="tables justify-items-center-safe" style="--table-header-background-color: {bg};">
	<Table
		bind:data
		caption_text={'A Basic Table'}
		--table-border-radius={'1rem'}
		visible_keys={['name', 'name_length', 'birthday', 'age']}
		data_cell={custom_data_cell}
	></Table>

	<Table
		data={players}
		visible_keys={['nickname', 'name', 'email', 'balance', 'joined']}
		{data_cell}
	/>

	{#snippet data_cell({ datum, key, value, index }: DataCell<Player>)}
		<td class="data-cell">
			{#if key === 'joined'}
				<ToggleSwitch
					checked={datum.joined}
					ontoggle={() => {
						console.log('toggle', datum.joined);
					}}
				/>
			{:else}
				<p>{value}</p>
			{/if}
		</td>
	{/snippet}
</div>

<style>
	td {
		--bg: light dark(var(--background), var(--background-dark));
		padding: 0.25rem 0.5rem;
		border: 1px solid var(--table-border-color);
		background-color: hsl(
			from light-dark(var(--accent), var(--dark-accent)) h s calc(l * var(--lightness))
		);
		color: white;
	}
	.shared-grid {
		display: grid;
		&.age {
			grid-template-areas: 'age';
			& > output {
				grid-area: age;
			}
		}
		&.name-length {
			grid-template-areas: 'name-length';
			& > output {
				grid-area: name-length;
			}
		}
	}
</style>
