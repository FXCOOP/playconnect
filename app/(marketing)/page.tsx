import Link from 'next/link';
import {
  Users,
  Calendar,
  MapPin,
  Shield,
  Heart,
  Sparkles,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              Now available in your area.{' '}
              <Link href="/sign-up" className="font-semibold text-blue-600">
                <span className="absolute inset-0" aria-hidden="true" />
                Get started <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Find Perfect Playdates for Your Kids
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Connect with nearby families based on shared interests, age compatibility, and availability.
            Safe, secure, and designed for modern parents.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/sign-up"
              className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Get started free
            </Link>
            <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Everything you need</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Playdate coordination made simple
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our intelligent matching system takes the guesswork out of finding compatible playmates for your children.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-7xl sm:mt-20 lg:mt-24">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              {/* Feature 1 */}
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  Smart Matching
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Our algorithm matches families based on shared interests, age compatibility, and location. Every match comes with an explanation of why it's a great fit.
                </dd>
              </div>

              {/* Feature 2 */}
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  Easy Scheduling
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  See overlapping availability at a glance. Propose times, get calendar invites, and receive automatic reminders. No more endless back-and-forth.
                </dd>
              </div>

              {/* Feature 3 */}
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  Location Privacy
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Your exact address is never shared. We show approximate distances until both families agree to connect. Safety and privacy come first.
                </dd>
              </div>

              {/* Feature 4 */}
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  Safety Controls
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Email verification required. Report inappropriate users. Transparent allergy and pet information. Moderated by real humans.
                </dd>
              </div>

              {/* Feature 5 */}
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  Interest Circles
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Join or create groups around shared interests. Lego builders, soccer fans, book clubs—find your tribe and schedule group activities.
                </dd>
              </div>

              {/* Feature 6 */}
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  Compatibility Insights
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  See why each match works: shared interests, similar ages, convenient distance, overlapping schedules. Make informed decisions.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How it works
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Get started in minutes. No credit card required.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              {[
                {
                  step: 1,
                  title: 'Create your profile',
                  description: 'Sign up and add your household information. Set your match preferences.',
                },
                {
                  step: 2,
                  title: 'Add your children',
                  description: 'Create profiles with interests, availability, and special needs. Privacy built-in.',
                },
                {
                  step: 3,
                  title: 'Discover matches',
                  description: 'Browse compatible families in your area. See why each match works for you.',
                },
                {
                  step: 4,
                  title: 'Connect & play',
                  description: 'Propose playdates, chat with parents, and watch your kids make new friends!',
                },
              ].map((item) => (
                <div key={item.step} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                      {item.step}
                    </div>
                    {item.title}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{item.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Built for safety and privacy
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We take your family's safety seriously. Every feature is designed with COPPA and GDPR compliance in mind.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-12 lg:max-w-none lg:grid-cols-2">
              {[
                'Email verification required for all accounts',
                'No exact addresses or birth dates stored',
                'Photos blurred by default until consent',
                'Report and block inappropriate users',
                'Admin moderation of all custom content',
                'Full data export and deletion on request',
              ].map((feature) => (
                <div key={feature} className="flex gap-x-3">
                  <CheckCircle className="h-6 w-6 flex-none text-green-600" />
                  <span className="text-base leading-7 text-gray-600">{feature}</span>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to find perfect playdates?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
            Join families in your area who are already connecting their kids through shared interests and activities.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/sign-up"
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white inline-flex items-center gap-2"
            >
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 sm:py-16 lg:px-8">
          <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
            <div className="pb-6">
              <Link href="/about" className="text-sm leading-6 text-gray-300 hover:text-white">
                About
              </Link>
            </div>
            <div className="pb-6">
              <Link href="/privacy" className="text-sm leading-6 text-gray-300 hover:text-white">
                Privacy
              </Link>
            </div>
            <div className="pb-6">
              <Link href="/terms" className="text-sm leading-6 text-gray-300 hover:text-white">
                Terms
              </Link>
            </div>
            <div className="pb-6">
              <a href="mailto:support@playconnect.app" className="text-sm leading-6 text-gray-300 hover:text-white">
                Contact
              </a>
            </div>
          </nav>
          <p className="mt-10 text-center text-xs leading-5 text-gray-400">
            &copy; {new Date().getFullYear()} PlayConnect. Built with ❤️ for families everywhere.
          </p>
        </div>
      </footer>
    </div>
  );
}
